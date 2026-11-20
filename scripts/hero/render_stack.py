"""
Renders the homepage hero: five layers (your systems, business context, AI,
human review, business outcomes) as a lit studio scene, folding from exploded
(frame 0) into the AI core (last frame) while the camera eases in.

    python scripts/hero/render_stack.py -- <logo.png> <out_dir> [frames] [size] [samples] [frame,frame,...]

Needs Blender 5.2 as a Python module (pip install bpy==5.2.4) or the app
(blender -b -P ... -- args). Writes <out_dir>/f_###.png (RGBA, transparent
background with a shadow catcher) and <out_dir>/labels.json (screen y of each
layer at frame 0, as a fraction of the image height, for the HTML labels).
"""
import json
import math
import os
import sys

import bpy  # must come first: mathutils and bpy_extras come from Blender
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Euler, Vector

argv = sys.argv[sys.argv.index("--") + 1:]
LOGO, OUT = argv[0], argv[1]
FRAMES = int(argv[2]) if len(argv) > 2 else 48
SIZE = int(argv[3]) if len(argv) > 3 else 1000
SAMPLES = int(argv[4]) if len(argv) > 4 else 48
ONLY = [int(x) for x in argv[5].split(",")] if len(argv) > 5 else None

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.frame_start, sc.frame_end = 0, FRAMES - 1


def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c) + (1.0,)


def mat(name, color, rough=0.35, metal=0.0, coat=0.0, trans=0.0, ior=1.45, emit=None, strength=0.0, alpha=1.0):
    m = bpy.data.materials.new(name)
    b = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    b.inputs["Base Color"].default_value = srgb(color)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Coat Roughness"].default_value = 0.08
    b.inputs["Transmission Weight"].default_value = trans
    b.inputs["IOR"].default_value = ior
    b.inputs["Alpha"].default_value = alpha
    if emit:
        b.inputs["Emission Color"].default_value = srgb(emit)
        b.inputs["Emission Strength"].default_value = strength
    return m


M = {
    "ceramic": mat("Ceramic", "#F4F1EA", rough=0.34, coat=0.7),
    "ceramic_edge": mat("Edge", "#DCD6CB", rough=0.5),
    "glass_ai": mat("AI glass", "#BFE7EA", rough=0.12, trans=1.0, coat=1.0, emit="#16A3B0", strength=0.25),
    "frost": mat("Frost", "#CFEDEE", rough=0.3, coat=0.8, emit="#16A3B0", strength=0.15),
    "blue": mat("Blue module", "#FFFFFF", rough=0.3, coat=0.8, emit="#2583DB", strength=0.0),
    "amber": mat("Amber", "#E9A54A", rough=0.32, coat=0.6),
    "green": mat("Green", "#BFE3C4", rough=0.32, coat=0.6),
    "navy": mat("Navy", "#0E2236", rough=0.25, metal=0.2, coat=1.0),
    "core": mat("Core", "#16A3B0", rough=0.2, coat=1.0, emit="#2BB3A8", strength=3.0),
    "wire_teal": mat("Wire teal", "#16A3B0", emit="#16A3B0", strength=4.0),
    "wire_blue": mat("Wire blue", "#2583DB", emit="#2583DB", strength=4.0),
    "wire_green": mat("Wire green", "#1FA92F", emit="#1FA92F", strength=4.0),
    "wire_amber": mat("Wire amber", "#F2B45C", emit="#F2B45C", strength=4.0),
    "packet": mat("Packet", "#FFFFFF", emit="#9EF0F2", strength=18.0),
}
# blue modules: tinted edge via a coloured base
M["blue"].node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = srgb("#CFE2F6")


def rounded_box(name, size, z, material, bevel=0.05, rot=45):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, z))
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    m = o.modifiers.new("Bevel", "BEVEL")
    m.width, m.segments, m.limit_method = bevel, 4, "ANGLE"
    o.rotation_euler = Euler((0, 0, math.radians(rot)))
    o.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    return o


S = 2.2
LAYERS = [  # name, exploded z, size, thickness, material
    ("systems", 2.25, S, 0.12, M["ceramic"]),
    ("context", 1.12, S, 0.12, M["ceramic"]),
    ("ai", 0.0, S * 1.12, 0.2, M["glass_ai"]),
    ("human", -1.12, S, 0.12, M["ceramic"]),
    ("outcomes", -2.25, S, 0.12, M["ceramic"]),
]
FOLD = 0.2  # compact spacing as a share of exploded spacing

groups = {}
for name, z, size, t, m in LAYERS:
    root = bpy.data.objects.new(f"L_{name}", None)
    sc.collection.objects.link(root)
    root.location = (0, 0, z)
    slab = rounded_box(f"{name}_slab", (size, size, t), 0, m, bevel=0.06 if name != "ai" else 0.08)
    slab.parent = root
    if name == "ai":  # navy body under the glass
        base = rounded_box("ai_base", (size * 0.98, size * 0.98, 0.07), -0.13, M["navy"], bevel=0.03)
        base.parent = root
    groups[name] = root


def module(parent, x, y, s, h, m, z0):
    o = rounded_box("mod", (s, s, h), 0, m, bevel=min(s, h) * 0.25)
    o.parent = parent
    o.location = (x, y, z0 + h / 2)
    return o


# modules on the front half of each plate (camera looks from -Y)
for (x, y) in [(-0.55, -0.45), (0.0, -0.75), (0.55, -0.45), (-0.25, -0.15), (0.3, -0.12)]:
    module(groups["systems"], x, y, 0.2, 0.14, M["blue"], 0.06)
for i, (x, y) in enumerate([(-0.45, -0.35), (0.45, -0.35), (0.0, -0.7)]):
    module(groups["context"], x, y, 0.32, 0.03 + i * 0.025, M["frost"], 0.06)
for (x, y) in [(-0.3, -0.45), (0.3, -0.45)]:
    module(groups["human"], x, y, 0.22, 0.16, M["amber"], 0.06)
for (x, y) in [(-0.55, -0.4), (0.0, -0.72), (0.55, -0.4), (0.0, -0.2)]:
    module(groups["outcomes"], x, y, 0.2, 0.14, M["green"], 0.06)

# AI core: hexagonal prism with a white badge and the Moksh mark
bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.42, depth=0.42, location=(0, 0, 0.33))
core = bpy.context.active_object
core.name = "core"
core.rotation_euler = Euler((0, 0, math.radians(90)))
bev = core.modifiers.new("Bevel", "BEVEL")
bev.width, bev.segments = 0.03, 3
core.data.materials.append(M["core"])
core.parent = groups["ai"]
img = bpy.data.images.load(LOGO)
badge_m = bpy.data.materials.new("Badge")
nt = badge_m.node_tree
bsdf = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
tex = nt.nodes.new("ShaderNodeTexImage")
tex.image = img
nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
nt.links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])
bsdf.inputs["Roughness"].default_value = 0.4
bpy.ops.mesh.primitive_plane_add(size=0.34, location=(0, -0.37, 0.33), rotation=(math.radians(90), 0, 0))
badge = bpy.context.active_object
badge.data.materials.append(badge_m)
badge.parent = groups["ai"]
bpy.ops.mesh.primitive_plane_add(size=0.4, location=(0, -0.366, 0.33), rotation=(math.radians(90), 0, 0))
plate = bpy.context.active_object
plate.data.materials.append(mat("Badge plate", "#FFFFFF", rough=0.3, coat=1.0))
plate.parent = groups["ai"]

# light filaments between layers, each with a travelling packet
order = [n for n, *_ in LAYERS]
wire_m = {"systems": M["wire_blue"], "context": M["wire_teal"], "ai": M["wire_green"], "human": M["wire_amber"]}
filaments = []
for i in range(len(order) - 1):
    up, lo = order[i], order[i + 1]
    for x, y in ([(-0.7, -0.35), (0.7, -0.35)] if "ai" in (up, lo) else [(-0.55, -0.55), (0.0, -0.9), (0.55, -0.55)]):
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.009, depth=1, location=(x, y, 0))
        w = bpy.context.active_object
        w.data.materials.append(wire_m[up])
        bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=6, radius=0.028, location=(x, y, 0))
        pk = bpy.context.active_object
        pk.data.materials.append(M["packet"])
        filaments.append((w, pk, up, lo, len(filaments) * 0.37))

# shadow catcher floor
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, -3.1))
floor = bpy.context.active_object
floor.is_shadow_catcher = True

# lights: soft key above-left, cool teal rim behind-right, warm fill front
def area(loc, energy, color, size):
    ld = bpy.data.lights.new("A", "AREA")
    ld.energy, ld.color, ld.size = energy, color, size
    o = bpy.data.objects.new("A", ld)
    o.location = loc
    o.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    sc.collection.objects.link(o)


area((-5, -4, 8), 2600, (1.0, 0.98, 0.95), 7)
area((5, 4, 3), 900, (0.45, 0.85, 0.88), 4)
area((0, -8, 1), 500, (1.0, 0.95, 0.9), 6)
sc.world = bpy.data.worlds.new("W")
sc.world.color = (0.62, 0.6, 0.57)

cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
sc.collection.objects.link(cam)
sc.camera = cam
cam.data.lens = 50
cam.data.dof.use_dof = True
cam.data.dof.aperture_fstop = 5.6
target = bpy.data.objects.new("T", None)
sc.collection.objects.link(target)
cam.data.dof.focus_object = target

r = sc.render
r.engine = "CYCLES"
sc.cycles.device = "CPU"
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True
sc.cycles.max_bounces = 8
sc.cycles.transmission_bounces = 8
r.film_transparent = True
sc.cycles.film_transparent_glass = True
r.resolution_x = r.resolution_y = SIZE
r.image_settings.file_format = "PNG"
r.image_settings.color_mode = "RGBA"
sc.view_settings.view_transform = "AgX"


def ease(t):
    return t * t * (3 - 2 * t)


def pose(f):
    t = ease(f / max(1, FRAMES - 1))
    for name, z, *_ in LAYERS:
        groups[name].location.z = z * (1 - (1 - FOLD) * t)
    for w, pk, up, lo, off in filaments:
        za, zb = groups[up].location.z - 0.06, groups[lo].location.z + 0.06
        w.location.z = (za + zb) / 2
        w.scale.z = max(0.001, za - zb)
        u = (f / FRAMES * 2 + off) % 1
        pk.location.z = za - (za - zb) * u
        pk.scale = (1, 1, 1) if za - zb > 0.15 else (0.001, 0.001, 0.001)
    core.scale.z = 1 - 0.8 * t
    core.location.z = 0.12 + 0.21 * core.scale.z
    for o in (badge, plate):
        o.location.z = core.location.z
        o.scale = (1, 1, 1) if t < 0.45 else (0.001, 0.001, 0.001)
    floor.location.z = groups["outcomes"].location.z - 0.9
    M["core"].node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 3 + 9 * t
    az = math.radians(-9 + 15 * t)
    el = math.radians(27 + 5 * t)
    dist = 11.6 - 3.4 * t
    cam.location = (dist * math.sin(az) * math.cos(el) * 1, -dist * math.cos(az) * math.cos(el), dist * math.sin(el))
    cam.rotation_euler = (target.location - cam.location).to_track_quat("-Z", "Y").to_euler()
    target.location = (0, 0, 0)


os.makedirs(OUT, exist_ok=True)
frames = ONLY if ONLY is not None else range(FRAMES)
for f in frames:
    pose(f)
    bpy.context.view_layer.update()
    if f == 0:
        labels = {}
        for name, *_ in LAYERS:
            p = world_to_camera_view(sc, cam, groups[name].matrix_world.translation)
            labels[name] = round(1 - p.y, 4)
        with open(f"{OUT}/labels.json", "w") as fh:
            json.dump(labels, fh)
        # Top face of each plate on screen (fractions of the frame), for the
        # page's highlight overlay. Corners: back, right, front, left.
        plates = {}
        for name, z, size, t, _m in LAYERS:
            pts = []
            for lx, ly in ((0, 1), (1, 0), (0, -1), (-1, 0)):
                w = groups[name].matrix_world.translation + Vector((lx * size / math.sqrt(2), ly * size / math.sqrt(2), t / 2))
                q = world_to_camera_view(sc, cam, w)
                pts.append([round(q.x, 4), round(1 - q.y, 4)])
            plates[name] = pts
        with open(f"{OUT}/plates.json", "w") as fh:
            json.dump(plates, fh)
        if os.environ.get("GEOM_ONLY"):
            sys.exit(0)
    r.filepath = f"{OUT}/f_{f:03d}.png"
    bpy.ops.render.render(write_still=True)
print("RENDERED", len(list(frames)), "frames to", OUT)

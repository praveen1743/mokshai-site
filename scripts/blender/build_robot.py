"""
Build the Moksh AI hero robot from the CC0 Innerscene "Humanoid robot A-pose".

Run with Blender 5.2 (the `bpy` module or the Blender app):

    blender -b -P scripts/blender/build_robot.py -- <source.glb> <out.glb> [preview_dir]
    python  scripts/blender/build_robot.py -- <source.glb> <out.glb> [preview_dir]   # with `pip install bpy`

What it does, in order:
1. Imports the source GLB (27 rigid parts, no rig, no animation) and bakes every
   part's transform into its vertices (Blender space: Z up, the robot faces -Y).
2. Builds a humanoid armature whose joints sit on the model's own actuators
   (measured from the mesh: shoulder, elbow, wrist, neck, waist, hip, knee, ankle,
   four fingers and a thumb per hand) plus two eye bones.
3. Skins the mesh: every connected piece of geometry is weighted 100% to the bone
   it belongs to (rigid skinning, as a jointed machine moves).
4. Restyles the materials: white ceramic covers, brushed titanium actuators,
   glossy black faceplate, cyan eyes and sensor strips. Adds two eye meshes.
5. Joins the parts into one skinned mesh (one draw call per material).
6. Authors six actions as NLA tracks: Idle, Float, HeadLook, Blink, Present,
   Approve, and exports them with the skin as one GLB.

Poses are written as world-space rotations and converted to each bone's local
space, so the clips are readable here and stay correct through the hierarchy.
"""
import math
import sys

import bpy  # must come first: bmesh and mathutils are provided by Blender
import bmesh
from mathutils import Matrix, Quaternion, Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
SRC, OUT = argv[0], argv[1]
PREVIEW = argv[2] if len(argv) > 2 else None
FPS = 30

# ---------------------------------------------------------------- import ----
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = FPS
bpy.ops.import_scene.gltf(filepath=SRC)

meshes = [o for o in bpy.data.objects if o.type == "MESH"]
for o in meshes:
    mw = o.matrix_world.copy()
    o.parent = None
    o.data.transform(mw)
    o.matrix_world = Matrix.Identity(4)
for o in list(bpy.data.objects):
    if o.type != "MESH":
        bpy.data.objects.remove(o, do_unlink=True)

# ------------------------------------------------------------- skeleton ----
# Measured joint centres (left side, +X). Right side mirrors X.
ARM_DIR = Vector((0.233, 0.0, -0.205)).normalized()          # A-pose arm, ~41 deg down
ARM_NRM = Vector((0.66, 0.0, 0.75)).normalized()             # back of the hand
WRIST = Vector((0.62, 0.0, 1.036))
FINGERS = {  # lateral offset (Y) of each finger line, measured from the hand islands
    "Index": -0.0263, "Middle": -0.0049, "Ring": 0.0139, "Pinky": 0.0304,
}


def mirror(v: Vector) -> Vector:
    return Vector((-v.x, v.y, v.z))


def hand_point(along: float, lat: float, nrm: float, side: int) -> Vector:
    d = ARM_DIR if side > 0 else mirror(ARM_DIR)
    n = ARM_NRM if side > 0 else mirror(ARM_NRM)
    w = WRIST if side > 0 else mirror(WRIST)
    return w + d * along + Vector((0, lat, 0)) + n * nrm


bones = {}  # name: (head, tail, parent)
bones["Root"] = (Vector((0, 0, 0)), Vector((0, 0, 0.12)), None)
bones["Hips"] = (Vector((0, 0, 0.95)), Vector((0, 0, 1.085)), "Root")
bones["Spine"] = (Vector((0, 0, 1.085)), Vector((0, 0, 1.30)), "Hips")
bones["Chest"] = (Vector((0, 0, 1.30)), Vector((0, 0, 1.47)), "Spine")
bones["Neck"] = (Vector((0, 0, 1.47)), Vector((0, 0, 1.556)), "Chest")
bones["Head"] = (Vector((0, 0, 1.556)), Vector((0, 0, 1.73)), "Neck")

for side, s in ((1, "L"), (-1, "R")):
    m = (lambda v: v) if side > 0 else mirror
    bones[f"Clavicle_{s}"] = (m(Vector((0.06, 0, 1.418))), m(Vector((0.208, 0, 1.418))), "Chest")
    bones[f"UpperArm_{s}"] = (m(Vector((0.208, 0, 1.418))), m(Vector((0.443, 0, 1.213))), f"Clavicle_{s}")
    bones[f"Forearm_{s}"] = (m(Vector((0.443, 0, 1.213))), m(WRIST), f"UpperArm_{s}")
    bones[f"Hand_{s}"] = (m(WRIST), hand_point(0.115, -0.002, -0.012, side), f"Forearm_{s}")
    for f, lat in FINGERS.items():
        a = hand_point(0.120, lat, -0.020, side)
        b = hand_point(0.158, lat, -0.024, side)
        c = hand_point(0.200, lat, -0.030, side)
        bones[f"{f}1_{s}"] = (a, b, f"Hand_{s}")
        bones[f"{f}2_{s}"] = (b, c, f"{f}1_{s}")
    bones[f"Thumb1_{s}"] = (hand_point(0.048, -0.042, -0.004, side), hand_point(0.072, -0.056, -0.028, side), f"Hand_{s}")
    bones[f"Thumb2_{s}"] = (hand_point(0.072, -0.056, -0.028, side), hand_point(0.098, -0.060, -0.078, side), f"Thumb1_{s}")
    bones[f"Thigh_{s}"] = (m(Vector((0.093, 0, 0.95))), m(Vector((0.128, 0, 0.506))), "Hips")
    bones[f"Shin_{s}"] = (m(Vector((0.128, 0, 0.506))), m(Vector((0.156, 0, 0.088))), f"Thigh_{s}")
    bones[f"Foot_{s}"] = (m(Vector((0.156, 0, 0.088))), m(Vector((0.156, -0.15, 0.02))), f"Shin_{s}")

# Eyes: find the faceplate's front surface and put a bone on each eye.
visor = bpy.data.objects["Face visor"]
EYE_X, EYE_Z = 0.031, 1.646
eye_pts = {}
for side, s in ((1, "L"), (-1, "R")):
    origin = Vector((side * EYE_X, -0.5, EYE_Z))
    ok, loc, normal, _ = visor.ray_cast(origin, Vector((0, 1, 0)))
    if not ok:
        raise SystemExit(f"eye ray missed the visor on side {s}")
    eye_pts[s] = loc + Vector((0, -0.0012, 0))
    bones[f"Eye_{s}"] = (eye_pts[s], eye_pts[s] + Vector((0, -0.02, 0)), "Head")

arm_data = bpy.data.armatures.new("MokshRig")
rig = bpy.data.objects.new("MokshRig", arm_data)
scene.collection.objects.link(rig)
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode="EDIT")
for name, (h, t, p) in bones.items():
    eb = arm_data.edit_bones.new(name)
    eb.head, eb.tail = h, t
    eb.align_roll(Vector((0, -1, 0)) if abs((t - h).normalized().y) < 0.9 else Vector((0, 0, 1)))
for name, (_, _, p) in bones.items():
    if p:
        arm_data.edit_bones[name].parent = arm_data.edit_bones[p]
        arm_data.edit_bones[name].use_connect = False
bpy.ops.object.mode_set(mode="OBJECT")

# --------------------------------------------------------------- eyes -------
def make_eye(s: str) -> bpy.types.Object:
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=12, radius=1.0)
    me = bpy.data.meshes.new(f"Eye_{s}")
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(f"Eye {s}", me)
    scene.collection.objects.link(o)
    o.data.transform(Matrix.Diagonal((0.0125, 0.0022, 0.0042, 1.0)))
    o.data.transform(Matrix.Translation(eye_pts[s]))
    return o


eyes = [make_eye("L"), make_eye("R")]

# ------------------------------------------------------------- skinning -----
SIDE_OBJ = {
    "Arm covers": ["Clavicle", "UpperArm", "Forearm", "Hand"],
    "Shoulder and elbow actuators": ["Clavicle", "UpperArm", "Forearm", "Hand"],
    "Hand": ["Hand"] + [f"{f}{i}" for f in list(FINGERS) + ["Thumb"] for i in (1, 2)],
    "Hip actuators": ["Thigh"],
    "Thigh cover": ["Thigh"],
    "Ankle and knee actuators": ["Thigh", "Shin", "Foot"],
    "Shank cover": ["Shin"],
    "Shin actuator": ["Shin"],
    "Foot": ["Foot"],
}
CENTER_OBJ = {
    "Head shell": ["Head"], "Face visor": ["Head"], "Head side sensors": ["Head"],
    "Neck actuators": ["Neck", "Head"], "Torso cover": ["Chest"], "Chest panel": ["Chest"],
    "Waist actuator": ["Spine"], "Pelvis": ["Hips"], "Pelvis covers": ["Hips"],
}


def candidates(obj_name: str):
    if obj_name.startswith("Eye "):
        return [f"Eye_{obj_name[-1]}"]
    if obj_name in CENTER_OBJ:
        return CENTER_OBJ[obj_name]
    for base, names in SIDE_OBJ.items():
        if obj_name.startswith(base):
            s = "L" if obj_name.endswith("left") else "R"
            return [f"{n}_{s}" for n in names]
    raise SystemExit(f"no bone mapping for {obj_name}")


def seg_dist(p: Vector, a: Vector, b: Vector) -> float:
    ab = b - a
    t = max(0.05, min(1.0, (p - a).dot(ab) / ab.length_squared))  # heads win ties: housings follow the child
    return (a + ab * t - p).length


def islands(bm):
    bm.verts.ensure_lookup_table()
    seen, out = set(), []
    for v in bm.verts:
        if v.index in seen:
            continue
        stack, isl = [v], []
        seen.add(v.index)
        while stack:
            x = stack.pop()
            isl.append(x.index)
            for e in x.link_edges:
                y = e.other_vert(x)
                if y.index not in seen:
                    seen.add(y.index)
                    stack.append(y)
        out.append(isl)
    return out


for o in meshes + eyes:
    names = candidates(o.name)
    groups = {n: o.vertex_groups.new(name=n) for n in names}
    bm = bmesh.new()
    bm.from_mesh(o.data)
    bm.verts.ensure_lookup_table()
    for isl in islands(bm):
        c = sum((bm.verts[i].co for i in isl), Vector()) / len(isl)
        best = min(names, key=lambda n: seg_dist(c, bones[n][0], bones[n][1]))
        groups[best].add(isl, 1.0, "REPLACE")
    bm.free()

# ------------------------------------------------------------- materials ----
def principled(mat):
    return next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")


def drop_color_texture(bsdf):
    for link in list(bsdf.inputs["Base Color"].links):
        bsdf.id_data.links.remove(link)


def restyle(name, new_name, color, metallic, rough, coat=0.0, coat_rough=0.1, emit=None, emit_strength=0.0, aniso=0.0, keep_normal=True):
    mat = bpy.data.materials.get(name)
    if mat is None:
        return None
    mat.name = new_name
    b = principled(mat)
    drop_color_texture(b)
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = rough
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Coat Roughness"].default_value = coat_rough
    if "Anisotropic" in b.inputs:
        b.inputs["Anisotropic"].default_value = aniso
    if not keep_normal:
        for link in list(b.inputs["Normal"].links):
            mat.node_tree.links.remove(link)
    if emit is not None:
        for link in list(b.inputs["Emission Color"].links):
            mat.node_tree.links.remove(link)
        b.inputs["Emission Color"].default_value = (*emit, 1.0)
        b.inputs["Emission Strength"].default_value = emit_strength
    return mat


restyle("White painted robot cover", "Ceramic white", (0.86, 0.865, 0.85), 0.0, 0.24, coat=1.0, coat_rough=0.06, keep_normal=False)
restyle("Graphite powder coat", "Brushed titanium", (0.56, 0.565, 0.58), 1.0, 0.34, aniso=0.6)
restyle("Dark grey ABS", "Dark titanium", (0.16, 0.165, 0.175), 1.0, 0.38, aniso=0.4)
restyle("Gloss black visor", "Gloss black faceplate", (0.006, 0.007, 0.009), 0.0, 0.04, coat=1.0, coat_rough=0.02, keep_normal=False)
restyle("Cyan light strip", "Cyan sensor", (0.02, 0.18, 0.21), 0.0, 0.3, emit=(0.16, 0.78, 0.86), emit_strength=6.0, keep_normal=False)

eye_mat = bpy.data.materials.new("Cyan eye")
eye_mat.use_nodes = True
eb = principled(eye_mat)
eb.inputs["Base Color"].default_value = (0.02, 0.2, 0.24, 1)
eb.inputs["Emission Color"].default_value = (0.25, 0.85, 0.95, 1)
eb.inputs["Emission Strength"].default_value = 9.0
eb.inputs["Roughness"].default_value = 0.2
for e in eyes:
    e.data.materials.append(eye_mat)

# ----------------------------------------------------------- join + skin ----
bpy.ops.object.select_all(action="DESELECT")
for o in meshes + eyes:
    o.select_set(True)
body = meshes[0]
bpy.context.view_layer.objects.active = body
bpy.ops.object.join()
body.name = "MokshRobot"
body.data.name = "MokshRobot"
try:
    bpy.ops.object.shade_auto_smooth(angle=math.radians(35))
except Exception as exc:  # smoothing is cosmetic; the source normals are kept otherwise
    print("auto smooth skipped:", exc)
body.parent = rig
mod = body.modifiers.new("Armature", "ARMATURE")
mod.object = rig

# ----------------------------------------------------------- animation ------
pose = rig.pose
rest = {n: rig.data.bones[n].matrix_local.to_quaternion() for n in bones}
order = list(bones)  # parents come before children
for pb in pose.bones:
    pb.rotation_mode = "QUATERNION"


def qaxis(axis, deg):
    return Quaternion(Vector(axis).normalized(), math.radians(deg))


def rest_dir(n):
    h, t, _ = bones[n]
    return (t - h).normalized()


def aim(n, target):
    return rest_dir(n).rotation_difference(Vector(target).normalized())


def frame_rot(f0, u0, f1, u1):
    """Rotation taking the orthonormal frame (f0, u0) onto (f1, u1)."""
    def basis(f, u):
        f = f.normalized()
        u = (u - f * u.dot(f)).normalized()
        return Matrix((f, u, f.cross(u))).transposed()
    return (basis(f1, u1) @ basis(f0, u0).inverted()).to_quaternion()


def side_sign(s):
    return 1 if s == "L" else -1


def palm_dir(s):
    return -(ARM_NRM if s == "L" else mirror(ARM_NRM))


def curl(s, n, deg):
    """Finger curl towards the palm, in the bone's rest frame (world axes)."""
    return qaxis(rest_dir(n).cross(palm_dir(s)), deg)


def bend_forward(n, deg):
    return qaxis(rest_dir(n).cross(Vector((0, -1, 0))), deg)


def relaxed(W, s, arm_down=28, elbow=14, finger=14, sway=0.0):
    """Arm hanging close to the body: world deltas written into W."""
    sg = side_sign(s)
    W[f"UpperArm_{s}"] = qaxis((0, sg, 0), arm_down) @ qaxis((1, 0, 0), sway)
    W[f"Forearm_{s}"] = W[f"UpperArm_{s}"] @ bend_forward(f"Forearm_{s}", elbow)
    W[f"Hand_{s}"] = W[f"Forearm_{s}"] @ bend_forward(f"Hand_{s}", 4)
    for f in FINGERS:
        W[f"{f}1_{s}"] = W[f"Hand_{s}"] @ curl(s, f"{f}1_{s}", finger)
        W[f"{f}2_{s}"] = W[f"{f}1_{s}"] @ curl(s, f"{f}2_{s}", finger * 1.2)
    W[f"Thumb1_{s}"] = W[f"Hand_{s}"]
    W[f"Thumb2_{s}"] = W[f"Hand_{s}"] @ curl(s, f"Thumb2_{s}", 10)


def to_local(W):
    """World-space deltas -> local pose quaternions (missing bones follow their parent)."""
    full, local = {}, {}
    for n in order:
        p = bones[n][2]
        P = full.get(p, Quaternion()) if p else Quaternion()
        full[n] = W.get(n, P)
        B = rest[n]
        local[n] = B.inverted() @ P.inverted() @ full[n] @ B
    return local


AUTHORED = {}  # action name -> {bone: set of glTF paths}; the exporter writes every bone, so this is used to strip the rest


def note(n, path):
    AUTHORED.setdefault(rig.animation_data.action.name, {}).setdefault(n, set()).add(path)


def key(action_bones, frame, W, loc=None, scale=None, only=None):
    local = to_local(W)
    for n in (only if only is not None else local):
        note(n, "rotation")
        pb = pose.bones[n]
        pb.rotation_quaternion = local[n]
        pb.keyframe_insert("rotation_quaternion", frame=frame)
    for n, v in (loc or {}).items():
        note(n, "translation")
        pose.bones[n].location = v
        pose.bones[n].keyframe_insert("location", frame=frame)
    for n, v in (scale or {}).items():
        note(n, "scale")
        pose.bones[n].scale = v
        pose.bones[n].keyframe_insert("scale", frame=frame)


UPPER = ["Spine", "Chest", "Clavicle_L", "Clavicle_R"] + [b for b in bones if b.split("_")[0] in
         ("UpperArm", "Forearm", "Hand") or any(b.startswith(f) for f in list(FINGERS) + ["Thumb"])]
HEAD = ["Neck", "Head"]
LEGS = [b for b in bones if b.startswith(("Thigh", "Shin", "Foot"))]


def base_upper(breath=0.0, sway=0.0):
    """Relaxed standing upper body. breath 0..1 lifts the chest and shoulders."""
    W = {}
    W["Spine"] = qaxis((1, 0, 0), -0.8 * breath)
    W["Chest"] = W["Spine"] @ qaxis((1, 0, 0), -1.6 * breath)
    for s in "LR":
        W[f"Clavicle_{s}"] = W["Chest"] @ qaxis((0, -side_sign(s), 0), 1.4 * breath)
        relaxed(W, s, sway=sway * side_sign(s))
        for n in [b for b in bones if b.endswith(f"_{s}") and b.split("_")[0] not in ("Clavicle", "Thigh", "Shin", "Foot", "Eye")]:
            W[n] = W[f"Clavicle_{s}"] @ W[n]
    return W


def new_action(name, frames):
    act = bpy.data.actions.new(name)
    rig.animation_data_create()
    rig.animation_data.action = act
    scene.frame_start, scene.frame_end = 0, frames
    for pb in pose.bones:
        pb.rotation_quaternion = Quaternion()
        pb.location = Vector()
        pb.scale = Vector((1, 1, 1))
    return act


def push(act):
    track = rig.animation_data.nla_tracks.new()
    track.name = act.name
    strip = track.strips.new(act.name, int(act.frame_range[0]), act)
    strip.name = act.name
    track.mute = True
    rig.animation_data.action = None


actions = []

# 1. Idle: breathing on a 4 s loop, relaxed arms with a slight sway.
act = new_action("Idle", 120)
for f, br, sw in ((0, 0, 0), (60, 1, 1.2), (120, 0, 0)):
    key(act, f, base_upper(br, sw), only=UPPER)
actions.append(act)

# 2. Float: the whole robot hovers on a 5 s loop; legs trail slightly.
act = new_action("Float", 150)
for f, z, tilt in ((0, 0.0, 0.0), (75, 0.035, 1.0), (150, 0.0, 0.0)):
    W = {"Root": qaxis((0, 1, 0), 0.6 * tilt)}
    for s in "LR":
        W[f"Thigh_{s}"] = W["Root"] @ qaxis((1, 0, 0), -2.5 * tilt)
        W[f"Shin_{s}"] = W[f"Thigh_{s}"] @ qaxis((1, 0, 0), 3.5 * tilt)
        W[f"Foot_{s}"] = W[f"Shin_{s}"] @ qaxis((1, 0, 0), -3.0 * tilt - 4)
    key(act, f, W, loc={"Root": Vector((0, 0, z))}, only=["Root"] + LEGS)
actions.append(act)

# 3. HeadLook: slow look around, 8 s loop (the site layers cursor tracking on top).
act = new_action("HeadLook", 240)
for f, yaw, pitch in ((0, 0, 0), (50, 14, -3), (100, 14, -3), (140, -12, 2), (190, -12, 2), (240, 0, 0)):
    W = {"Neck": qaxis((0, 0, 1), yaw * 0.4) @ qaxis((1, 0, 0), pitch * 0.4)}
    W["Head"] = qaxis((0, 0, 1), yaw) @ qaxis((1, 0, 0), pitch)
    key(act, f, W, only=HEAD)
actions.append(act)

# 4. Blink: eyelids close and open in 0.3 s.
act = new_action("Blink", 9)
for f, sz in ((0, 1.0), (3, 0.08), (5, 0.08), (9, 1.0)):
    key(act, f, {}, scale={"Eye_L": Vector((1, 1, sz)), "Eye_R": Vector((1, 1, sz))}, only=[])
actions.append(act)

# 5. Present: right hand opens towards the headline (screen left), palm up. 2.6 s.
act = new_action("Present", 78)


def blend(base, target, amount):
    """Slerp every bone in target from its base world delta."""
    W = dict(base)
    for n, q in target.items():
        W[n] = base.get(n, Quaternion()).slerp(q, amount)
    return W


def present_pose(amount):
    base = base_upper(0.4)
    s = "R"
    hand_dir = Vector((-0.55, -0.80, 0.08))
    T = {
        f"UpperArm_{s}": aim(f"UpperArm_{s}", Vector((-0.55, -0.45, -0.70))),
        f"Forearm_{s}": aim(f"Forearm_{s}", hand_dir),
        f"Hand_{s}": frame_rot(rest_dir(f"Hand_{s}"), palm_dir(s), hand_dir, Vector((0, 0, 1))),
        "Chest": base["Chest"] @ qaxis((0, 0, 1), -6),
    }
    for f in FINGERS:
        T[f"{f}1_{s}"] = T[f"Hand_{s}"] @ curl(s, f"{f}1_{s}", 6)
        T[f"{f}2_{s}"] = T[f"{f}1_{s}"] @ curl(s, f"{f}2_{s}", 6)
    T[f"Thumb1_{s}"] = T[f"Hand_{s}"]
    T[f"Thumb2_{s}"] = T[f"Hand_{s}"]
    return blend(base, T, amount)


for f, a in ((0, 0.0), (18, 0.7), (30, 1.0), (54, 1.0), (78, 0.0)):
    W = present_pose(a)
    W["Neck"] = qaxis((0, 0, 1), -8 * a)
    W["Head"] = qaxis((0, 0, 1), -16 * a) @ qaxis((1, 0, 0), 3 * a)
    key(act, f, W, only=UPPER + HEAD)
actions.append(act)

# 6. Approve: right thumbs-up and two nods. 2.4 s.
act = new_action("Approve", 72)


def approve_pose(amount):
    base = base_upper(0.4)
    s = "R"
    fdir = Vector((-0.15, -0.95, 0.28))
    T = {
        f"UpperArm_{s}": aim(f"UpperArm_{s}", Vector((-0.30, -0.25, -0.92))),
        f"Forearm_{s}": aim(f"Forearm_{s}", fdir),
        # thumb side of the hand (front, -Y at rest) turns to point up
        f"Hand_{s}": frame_rot(rest_dir(f"Hand_{s}"), Vector((0, -1, 0)), fdir, Vector((0, 0.25, 1))),
    }
    for f in FINGERS:
        T[f"{f}1_{s}"] = T[f"Hand_{s}"] @ curl(s, f"{f}1_{s}", 85)
        T[f"{f}2_{s}"] = T[f"{f}1_{s}"] @ curl(s, f"{f}2_{s}", 95)
    T[f"Thumb1_{s}"] = T[f"Hand_{s}"] @ rest_dir(f"Thumb1_{s}").rotation_difference(Vector((0, -1, 0)))
    T[f"Thumb2_{s}"] = T[f"Hand_{s}"] @ rest_dir(f"Thumb2_{s}").rotation_difference(Vector((0, -1, 0)))
    return blend(base, T, amount)


for f, a, nod in ((0, 0, 0), (16, 1, 0), (28, 1, 9), (36, 1, 0), (44, 1, 9), (52, 1, 0), (72, 0, 0)):
    W = approve_pose(a)
    W["Neck"] = qaxis((1, 0, 0), nod * 0.3)
    W["Head"] = qaxis((1, 0, 0), nod) @ qaxis((0, 0, 1), -6 * a)
    key(act, f, W, only=UPPER + HEAD)
actions.append(act)

for act in actions:
    push(act)

# ------------------------------------------------------------- previews -----
if PREVIEW:
    import os
    os.makedirs(PREVIEW, exist_ok=True)
    cam_data = bpy.data.cameras.new("Cam")
    cam_data.lens = 70
    cam = bpy.data.objects.new("Cam", cam_data)
    scene.collection.objects.link(cam)
    cam.location = (0.0, -4.6, 1.15)
    cam.rotation_euler = (math.radians(90), 0, 0)
    scene.camera = cam
    for loc, energy, color in (((-2, -3, 3), 800, (1, 1, 1)), ((2.5, -1, 2), 400, (0.6, 0.9, 1)), ((0, 2, 2), 500, (0.5, 0.9, 1))):
        ld = bpy.data.lights.new("L", "AREA")
        ld.energy, ld.color, ld.size = energy, color, 2.0
        lo = bpy.data.objects.new("L", ld)
        lo.location = loc
        lo.rotation_euler = (Vector((0, 0, 1.1)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        scene.collection.objects.link(lo)
    scene.world = bpy.data.worlds.new("W")
    scene.world.color = (0.02, 0.03, 0.05)
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = 24
    scene.cycles.use_denoising = False
    scene.render.resolution_x = scene.render.resolution_y = 520
    for act, frames in (("Idle", (0, 60)), ("Present", (30,)), ("Approve", (28,)), ("HeadLook", (50,)), ("Blink", (4,))):
        rig.animation_data.action = bpy.data.actions[act]
        for f in frames:
            scene.frame_set(f)
            scene.render.filepath = f"{PREVIEW}/{act}_{f:03d}.png"
            bpy.ops.render.render(write_still=True)
    rig.animation_data.action = None

# --------------------------------------------------------------- export -----
for mat in bpy.data.materials:  # closed shell: no need to draw back faces
    mat.use_backface_culling = True
for pb in pose.bones:
    pb.rotation_quaternion = Quaternion()
    pb.location = Vector()
    pb.scale = Vector((1, 1, 1))
bpy.ops.object.select_all(action="DESELECT")
rig.select_set(True)
body.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=True,
    export_yup=True,
    export_apply=False,
    export_skins=True,
    export_animations=True,
    export_animation_mode="NLA_TRACKS",
    export_force_sampling=False,   # only keyed channels, so clips can be layered
    export_optimize_animation_size=True,
    export_def_bones=False,
    export_materials="EXPORT",
    export_image_format="AUTO",
    export_copyright="Moksh AI robot. Based on 'Humanoid robot A-pose' by Innerscene Corp, CC0 1.0.",
)
import json
with open(OUT + ".channels.json", "w") as fh:
    json.dump({a: {b: sorted(p) for b, p in bs.items()} for a, bs in AUTHORED.items()}, fh, indent=1)
print("EXPORTED", OUT, "bones", len(bones), "actions", [a.name for a in actions])

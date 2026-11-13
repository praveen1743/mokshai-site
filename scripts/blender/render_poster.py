"""
Render the static fallback for the homepage robot: same model, Idle pose,
same framing as the web camera (src/components/robot/RobotScene.tsx), on a
transparent background.

    python scripts/blender/render_poster.py -- <robot.glb (uncompressed)> <out.png>
"""
import math
import sys

import bpy  # noqa: E402  (must load before mathutils)
from mathutils import Vector

src, out = sys.argv[-2], sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
sc = bpy.context.scene
rig = next(o for o in bpy.data.objects if o.type == "ARMATURE")
rig.location = (0.22, 0.0, -0.02)          # matches <group position> in Robot.tsx (glTF x, -z, y)
rig.animation_data_create()
rig.animation_data.action = bpy.data.actions["Idle"]
sc.frame_set(0)

cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
sc.collection.objects.link(cam)
sc.camera = cam
cam.data.sensor_fit = "VERTICAL"
cam.data.angle = math.radians(24)          # three.js fov is vertical
cam.location = (0.0, -3.35, 1.16)
cam.rotation_euler = (math.radians(90), 0, 0)


def area(loc, energy, color, size):
    ld = bpy.data.lights.new("L", "AREA")
    ld.energy, ld.color, ld.size = energy, color, size
    lo = bpy.data.objects.new("L", ld)
    lo.location = loc
    lo.rotation_euler = (Vector((0.22, 0, 1.1)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    sc.collection.objects.link(lo)


area((-2.2, -3.6, 3.2), 900, (1, 1, 1), 2.5)            # key, front-left
area((2.4, 2.2, 2.4), 450, (0.37, 0.82, 0.84), 1.5)     # cyan rim, behind-right
area((-2.6, 2.4, 1.6), 220, (0.15, 0.51, 0.86), 1.5)    # blue rim, behind-left
sc.world = bpy.data.worlds.new("W")
sc.world.color = (0.035, 0.045, 0.06)
sc.render.engine = "CYCLES"
sc.cycles.device = "CPU"
sc.cycles.samples = 96
sc.cycles.use_denoising = True
sc.render.film_transparent = True
sc.render.resolution_x = sc.render.resolution_y = 1000
sc.view_settings.view_transform = "AgX"
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGBA"
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
print("POSTER", out)

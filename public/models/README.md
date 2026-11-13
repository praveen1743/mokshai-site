# Homepage robot models

| File | What it is |
| --- | --- |
| `humanoid-robot-a-pose.glb` | Source model: "Humanoid robot A-pose" by Innerscene Corp, **CC0 1.0** (public domain dedication), from https://www.innerscene.com/tools/library/3d-parts/humanoid-robot-a-pose-0c18eadf. 27 rigid parts, about 28k triangles, no rig and no animation. Not loaded by the site; kept so the robot can be rebuilt. |
| `moksh-robot.glb` | The site's robot, built from the source by `npm run robot:build`: 42-bone armature, rigid skinning, Moksh materials, cyan eyes, six clips (Idle, Float, HeadLook, Blink, Present, Approve). Meshopt geometry, WebP textures at 1024 px, 8 draw calls. |
| `moksh-robot-poster.webp` | Static fallback: the same model in its Idle pose, rendered in Blender (Cycles) with the web camera's framing on a transparent background. |

## Rebuilding

Needs Blender 5.2, either the app on `PATH` or the Python module (`pip install bpy==5.2.4`):

```bash
PYTHON=/path/to/python-with-bpy npm run robot:build
```

Steps (`scripts/robot/build.sh`): `scripts/blender/build_robot.py` rigs, restyles and animates the source and exports a GLB; `scripts/robot/strip-channels.mjs` keeps only the channels each clip was authored with (so clips can be layered); `scripts/blender/render_poster.py` renders the poster; `gltf-transform optimize` compresses the GLB.

#!/usr/bin/env bash
# Rebuilds public/models/moksh-robot.glb from the CC0 source model.
# Needs Blender 5.2 as a Python module (pip install bpy==5.2.4) or the Blender app on PATH.
#   PYTHON=/path/to/python-with-bpy scripts/robot/build.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
SRC=public/models/humanoid-robot-a-pose.glb
TMP=$(mktemp -d)
if [ -n "${PYTHON:-}" ]; then
  "$PYTHON" -I scripts/blender/build_robot.py -- "$SRC" "$TMP/raw.glb"
else
  blender -b -P scripts/blender/build_robot.py -- "$SRC" "$TMP/raw.glb"
fi
node scripts/robot/strip-channels.mjs "$TMP/raw.glb" "$TMP/raw.glb.channels.json" "$TMP/stripped.glb"
if [ -n "${PYTHON:-}" ]; then
  "$PYTHON" -I scripts/blender/render_poster.py -- "$TMP/stripped.glb" "$TMP/poster.png"
else
  blender -b -P scripts/blender/render_poster.py -- "$TMP/stripped.glb" "$TMP/poster.png"
fi
node scripts/robot/poster-webp.mjs "$TMP/poster.png" public/models/moksh-robot-poster.webp
npx gltf-transform optimize "$TMP/stripped.glb" public/models/moksh-robot.glb \
  --compress meshopt --texture-compress webp --texture-size 1024 \
  --simplify false --flatten false --join false --instance false --palette false
rm -rf "$TMP"
ls -la public/models/moksh-robot.glb public/models/moksh-robot-poster.webp

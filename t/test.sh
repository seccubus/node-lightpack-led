#!/bin/bash
export NODE_PATH=".:./node_modules"
echo "*** get-Devices ***"
node get-device.js
echo "*** set different colors ***"
node setled.js
echo "*** Array test red,white,blue ***"
node arraytest.js

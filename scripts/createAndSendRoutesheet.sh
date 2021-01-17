#!/bin/bash

nodejs ~/projects/routesheets/createWorkRouteSheet/main.js

sleep 10

fileName=$(nodejs ~/projects/routesheets/helpers/printFileName.js)
echo $fileName;

if [ -f "$fileName" ]; then
    echo "$fileName exists: Sending File"
    nodejs ~/projects/routesheets/sendWorkRouteSheet/sendFile.js
else
    echo "$fileName does not exist: reattempting"
    bash ~/projects/routesheets/scripts/createAndSendRoutesheet.sh
fi
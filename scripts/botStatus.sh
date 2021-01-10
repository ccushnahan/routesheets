#!/bin/bash

timeStamp=`date`


if pgrep -x "nodejs" >/dev/null
then
  echo $timeStamp" bot is running" >> botCheckLog
else
  echo $timeStamp" bot is not running, restarting bot" >> botCheckLog
  bash ./startReadBot &
fi
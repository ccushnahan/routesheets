#!/bin/bash

npm install

mkdir ~/readsRecords
mkdir ~/completedRoutesheets

touch ~/readsRecords/reads.csv
touch ~/botCheckLog

cp ./botStatus.sh ~/botStatus.sh
cp ./startReadBot ~/startReadBot


chmod +x ~/startReadBot
chmod +x ~/botStatus.sh

(crontab -l 2>/dev/null || true; echo "*/15 * * * * ./botStatus.sh") | crontab -
(crontab -l 2>/dev/null || true; echo "0 0 * * SUN ./projects/routesheets/scripts/createAndSendRoutesheet.sh") | crontab -

bash ~/startReadBot &
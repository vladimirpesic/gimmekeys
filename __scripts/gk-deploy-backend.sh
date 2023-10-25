#!/bin/bash

start_time=$(date +%s)
echo "Deploying GimmeKeys backend..."

cd /opt/gimmekeys
git pull
sudo chmod +x -R /opt/gimmekeys/__scripts

cd /opt/gimmekeys/backend
sudo rm -rf build

npm install
npm run build

sudo rm -rf /var/www/gimmekeys/backend
sudo mkdir -p /var/www/gimmekeys/backend
sudo cp -rf build/* /var/www/gimmekeys/backend

sudo rm -rf /var/cache/nginx
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager

finish_time=$(date +%s)
elapsed_time=$((finish_time  - start_time))
((sec=elapsed_time%60, elapsed_time/=60, min=elapsed_time%60, hrs=elapsed_time/60))
timestamp=$(printf "GimmeKeys backend deployed in %d minutes and %d seconds." $min $sec)
echo $timestamp

#$SHELL

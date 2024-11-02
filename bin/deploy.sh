#!/bin/bash

cd ~

echo "Remove app"
pm2 delete all
rm -rf ~/.pm2/logs/*
rm -rf ~/website

echo "Deploy app"
git clone -b main git@github.com:deuexpo/website.git
cp ~/.env ~/website/.env
cd ~/website
npm i --production
chmod -R 775 ~/website

echo "Start app"
pm2 start ~/website/bin/http-server-start.config.cjs
pm2 save

exit
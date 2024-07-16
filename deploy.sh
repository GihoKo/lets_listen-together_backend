#!/bin/bash
cd /home/ubuntu/lets_listen-together_backend
git pull origin main
sudo npm install
pm2 restart lets_listen-together_backend_app

#!/bin/bash
cd ~/mcart
git pull origin main
sudo docker compose up -d --build frontend backend

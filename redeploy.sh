#!/bin/bash

# Remove old containers and images
sudo docker rm -f verizon_clone || true
sudo docker rmi verizon_clone:v1 || true

# Build new image
sudo docker build -t verizon_clone:v1 .

# Run new container
sudo docker run -d --name verizon_clone --restart unless-stopped -p 8012:3001 verizon_clone:v1

#!/bin/bash

git pull

docker build . -t srizan10/bask

docker stop bask

docker rm bask

docker run -d -t --name bask -p 8081:4020 --restart unless-stopped srizan10/bask
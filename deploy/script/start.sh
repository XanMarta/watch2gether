#!/bin/bash

# $1: DOCKERHUB_USERNAME
# $2: DOCKERHUB_TOKEN
# $3: TAG


export TAG=$3
echo "$2" | docker login -u $1 --password-stdin
docker compose -f $(dirname $(realpath $0))/docker-compose.yml down
docker compose -f $(dirname $(realpath $0))/docker-compose.yml up -d

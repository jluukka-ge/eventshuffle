#!/bin/bash

#
# Run in root directory of the app
#
docker compose \
  --env-file ./.env \
  -f ./src/services/persistent-storage/mongodb/docker-compose.test.integration.yaml \
  up -d;

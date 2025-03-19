#!/bin/bash -e

if test "$#" -lt 3; then
  echo "Usage:"
  echo "  $0 <USERNAME> <PASSWORD> <PATH_TO_SOURCE>"
  echo ""
  echo "  example: \"$0 root example ./db.dump"
  exit 1
fi

USERNAME="$1"
PASSWORD="$2"
PATH_TO_SOURCE="$3"

docker exec \
  -i eventshuffle-mongo-1 \
  sh -c "\
    exec mongorestore \
      --authenticationDatabase=admin \
      -u \"$USERNAME\" \
      -p \"$PASSWORD\" \
      --archive \
      --drop\
  " < "$PATH_TO_SOURCE"

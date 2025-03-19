#!/bin/bash -e

if test "$#" -lt 3; then
  echo "Usage:"
  echo "  $0 <USERNAME> <PASSWORD> <PATH_TO_TARGET>"
  echo ""
  echo "  example: \"$0 root example ./db.dump"
  exit 1
fi

USERNAME="$1"
PASSWORD="$2"
PATH_TO_TARGET="$3"

docker exec \
  eventshuffle-mongo-1 \
  sh -c "\
    exec mongodump \
      --authenticationDatabase=admin \
      -u \"$USERNAME\" \
      -p \"$PASSWORD\" \
      -d events \
      --archive\
  " > "$PATH_TO_TARGET"

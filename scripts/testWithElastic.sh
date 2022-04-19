#!/bin/bash -ex

testCommand="$1"
extraArgs="$2"

echo "esecuzione ----->"
echo "${testCommand} ${extraArgs}"

export COMPOSE_FILE=${COMPOSE_FILE:="docker-compose.yml"}

find_container_id() {
  echo $(docker ps \
    --filter "status=running" \
    --filter "label=custom.project=seecommerce2ui" \
    --filter "label=custom.service=elasticsearch1" \
    --no-trunc \
    -q)
}

quit() {
  docker-compose -f "${COMPOSE_FILE}" down --remove-orphans
  exit 1
}

if [ -z ${DO_NOT_STOP} ]; then
  trap quit ERR
fi

if [ -z "$(find_container_id)" ]; then
  echo -e "Start elastic docker container"
  NO_LOGS=1 $PWD/scripts/dockerComposeUp.sh
  if [ "1" = "$?" ]; then
    echo -e "Failed to start elastic image"
    exit 1
  fi
fi

eval "${testCommand} ${extraArgs}"
TEST_EXIT=$?
echo

if [ -z ${DO_NOT_STOP} ]; then
  docker-compose -f "${COMPOSE_FILE}" down --remove-orphans
fi
exit ${TEST_EXIT}

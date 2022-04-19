#!/bin/bash -e

COMPOSE_FILE=${COMPOSE_FILE:="docker-compose.yml"}

echo "Running compose file: ${COMPOSE_FILE}:"
docker-compose -f "${COMPOSE_FILE}" up --force-recreate -d
host="http://localhost:9200"
until $(curl --output /dev/null --silent --head --fail "$host"); do
    printf '.'
    sleep 1
done
# First wait for ES to start...
response=$(curl $host)
until [ "$response" = "200" ]; do
    response=$(curl --write-out %{http_code} --silent --output /dev/null "$host")
    >&2 echo "Elasticsearch is unavailable - sleeping"
    sleep 1
done
>&2 echo "Elasticsearch is up"
if [ -z "${NO_LOGS}" ]; then
  docker-compose -f "${COMPOSE_FILE}" logs -f
fi

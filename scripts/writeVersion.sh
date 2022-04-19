#!/usr/bin/env bash
ENV=$1
TAG=$2


LAST_COMMIT_HASH=`git log --pretty=format:'%H' -n 1`

if [ $1 = "dev" ]
then
  VERSION=`git describe --always`
  echo ${VERSION}
  echo "{\"version\":\"$VERSION\", \"lastCommitHash\":\"$LAST_COMMIT_HASH\"}" > ./version.json
else
  echo "{\"version\":\"$TAG\", \"lastCommitHash\":\"$LAST_COMMIT_HASH\"}" > ./version.json
fi

cp ./version.json ./static/version.json

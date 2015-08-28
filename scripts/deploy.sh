#!/bin/bash

# 0.1 check if jq has been installed
type jq >/dev/null 2>&1 || { echo >&2 "I require jq but it's not installed. Aborting."; exit 1; }

# 0.2 check if all files are commited
if [ ! -z "$(git status --porcelain)" ]; then
  echo "There are uncommitted files on master. Please commit or stash first!"
  git status
  exit 1
fi 
echo "All tracked files are commited. Publishing for npm & bower."

# 0.3 generate build files
npm run build
npm run schema

# 1. NPM PUBLISH 
npm publish
# exit if npm publish failed 
rc=$?
if [[ $rc != 0 ]]; then 
  echo "npm publish failed. Publishing cancelled."
  exit $rc; 
fi

# 2. BOWER PUBLISH
# read version
gitsha=$(git rev-parse HEAD)
version=$(cat package.json | jq .version | sed -e 's/^"//'  -e 's/"$//')

# swap to head so we don't commit compiled file to master along with tags
git checkout head

# add the compiled files, commit and tag!
git add vega-embed* -f
git commit -m "Release $version $gitsha."
git tag -am "Release v$version." "v$version"

# swap back to the clean master and push the new tag
git checkout master
git push --tags
# now the published tag contains build files which work great with bower.

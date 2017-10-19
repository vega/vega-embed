#!/bin/bash

# 0.1 check if all files are commited
if [ ! -z "$(git status --porcelain)" ]; then
  echo "There are uncommitted files on master. Please commit or stash first!"
  git status
  exit 1
fi
echo "All tracked files are commited. Publishing for npm & bower."

# 0.2 generate build files
npm run build

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
version=$(npm list vega-embed | head -n 1 | sed 's/.*@//' | awk '{print $1}')

# swap to head so we don't commit compiled file to master along with tags
git checkout head

# add the compiled files, commit and tag!
git add build/* -f
git commit -m "Release $version $gitsha."
git tag -am "Release v$version." "v$version"

# swap back to the clean master and push the new tag
git checkout master
git push --tags
# now the published tag contains build files which work great with bower.

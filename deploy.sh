#!/bin/bash -e

echo 'Cleaning up old files...'
rm -rf ./dist/

echo 'Running production build...'
npm run prod

echo 'Copying favicons...'
mkdir ./dist/assets/
mkdir ./dist/assets/img/
cp -R ./assets/img/favicon ./dist/assets/img/favicon/

echo 'Deploying...'
firebase deploy

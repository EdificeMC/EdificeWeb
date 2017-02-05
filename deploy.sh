#!/bin/bash -e

echo 'Cleaning up old files...'
rm -rf ./dist/

echo 'Running production build...'
npm run prod

echo 'Deploying...'
firebase deploy

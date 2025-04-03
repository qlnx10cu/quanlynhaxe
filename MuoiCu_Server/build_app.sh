#!/bin/bash

# Example bash script to run before starting a Node.js application

echo "Running pre-start setup..."
cd ../app || exit
npm install
npm run build
cp -r ./build/* ../MuoiCu_Server/public
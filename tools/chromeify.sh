#!/bin/sh

# Replace API namespace
find src -name "*.js" -exec sed -i 's/browser\./chrome./g' {} \; 

# Add imports to service workers
sed -i "1s|^|importScripts('./utils/jsonLoader.js');\nimportScripts('./utils/storage.js');\nimportScripts('./utils/indicatorparser.js');\nimportScripts('./utils/graph.js');\n\n|" src/background.js

# Replace browserAction
find src/ -name "*.js" -exec sed -i 's/chrome\.browserAction\./chrome.action./g' {} \; 

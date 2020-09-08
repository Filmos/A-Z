echo metaStorage = { > www/metaStorage.js
echo|set /p="   commits: " >> www/metaStorage.js
git rev-list --all --count >> www/metaStorage.js
echo } >> www/metaStorage.js

cordova run electron --nobuild
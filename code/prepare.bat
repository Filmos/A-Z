echo metaStorage = { > www/metaStorage.js
echo|set /p="   commits: " >> www/metaStorage.js
git rev-list --all --count >> www/metaStorage.js
echo } >> www/metaStorage.js

@RD /S /Q www
xcopy /i src www
npx webpack --config webpack.config.js
CALL npx ttsc -p . --outFile www/script.js
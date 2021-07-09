echo metaStorage = { > www/metaStorage.js
echo|set /p="   commits: " >> www/metaStorage.js
git rev-list --all --count >> www/metaStorage.js
echo } >> www/metaStorage.js

@RD /S /Q www
xcopy /s /i src www
CALL npx ttsc -p . --outFile www/script.js
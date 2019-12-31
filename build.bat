call npm run build
xcopy /s/e /y .\build ..\syncplay-two-build\build
cd ..\syncplay-two-build\
call electron-packager ./ --overwrite
7z a -r -spe -tzip syncplay-two-build-win32-x64.zip .\syncplay-two-build-win32-x64
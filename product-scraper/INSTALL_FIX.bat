@echo off
echo Installing backend dependencies...
echo.

REM Remove old installations
if exist node_modules rmdir /s /q node_modules
if exist pnpm-lock.yaml del pnpm-lock.yaml

REM Install with pnpm
pnpm install

echo.
echo Installation complete!
echo Now you can run 'npm start' from the root directory
pause

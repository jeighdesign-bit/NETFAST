@echo off
set /p msg="Enter commit message (or press Enter for default): "
if "%msg%"=="" set msg="Update Netfast Improvements"

echo.
echo [1/3] Adding changes...
git add .

echo [2/3] Committing changes: %msg%
git commit -m "%msg%"

echo [3/3] Pushing to GitHub...
git push

echo.
echo Done! Inyong mga changes naa na sa GitHub.
pause

@echo off
setlocal
echo ========================================================
echo     SkillSphere - Push to GitHub Helper Script
echo ========================================================
echo.

set PATH=%LOCALAPPDATA%\Programs\nodejs;%LOCALAPPDATA%\Programs\git\cmd;%PATH%

echo Step 1: Checking Git status...
git status
echo.

set /p REPO_URL="Enter your GitHub repository URL (e.g. https://github.com/username/skillsphere.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No repository URL entered. Exiting.
    pause
    exit /b 1
)

echo.
echo Step 2: Setting main branch...
git branch -M main

echo Step 3: Setting remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo Step 4: Staging any new changes...
git add .
git commit -m "feat: updates to SkillSphere P2P learning platform" 2>nul

echo Step 5: Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! SkillSphere has been pushed to your GitHub!
    echo ========================================================
) else (
    echo.
    echo [NOTE] If you were prompted for credentials, please sign in via your browser or Personal Access Token (PAT).
)

echo.
pause


@echo off
echo Building Hostel Management APK...
echo.

echo Step 1: Building web app...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Step 2: Syncing with Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Sync failed!
    pause
    exit /b 1
)

echo Step 3: Opening Android Studio...
echo Please build the APK in Android Studio:
echo 1. Build -> Generate Signed Bundle / APK
echo 2. Choose APK
echo 3. Select debug or release
echo 4. APK will be generated in android/app/build/outputs/apk/

call npx cap open android

echo Build script completed!
pause
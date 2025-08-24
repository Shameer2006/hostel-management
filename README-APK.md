# Building APK for Hostel Management App

## Prerequisites
1. **Android Studio** - Download from https://developer.android.com/studio
2. **Java JDK 11 or higher** - Required for Android development
3. **Android SDK** - Installed via Android Studio

## Quick Build (Recommended)
Run the build script:
```bash
build-apk.bat
```

## Manual Build Steps

### 1. Build Web App
```bash
npm run build
```

### 2. Sync with Android
```bash
npx cap sync android
```

### 3. Open Android Studio
```bash
npx cap open android
```

### 4. Generate APK in Android Studio
1. Go to **Build** → **Generate Signed Bundle / APK**
2. Select **APK**
3. Choose **debug** (for testing) or **release** (for distribution)
4. Click **Finish**

The APK will be generated in:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

## Development Commands
- `npm run android:dev` - Run on connected Android device/emulator
- `npm run build:mobile` - Build and sync for mobile
- `npm run android:build` - Full build process

## Troubleshooting
- Ensure Android Studio and SDK are properly installed
- Make sure USB debugging is enabled on your device
- Check that Java JDK is in your PATH
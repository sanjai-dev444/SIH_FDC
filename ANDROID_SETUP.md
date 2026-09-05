# Field Screening Companion — Android & Capacitor Setup Guide

This guide provides step-by-step instructions to convert and package the **Digital Field Drug Screening Companion** (Tamil Nadu & India Edition) into a native Android APK and Google Play Android App Bundle (AAB) using Capacitor.

---

## Prerequisites

Before building the Android package, ensure your workstation has:
1. **Node.js** (v18 or higher) and **npm**
2. **Java Development Kit (JDK)**: JDK 17 or JDK 21 (e.g. Eclipse Temurin or Oracle OpenJDK)
3. **Android Studio**: Android Studio Hedgehog, Iguana, Jellyfish, or newer
   - Android SDK Platform 34 or 35
   - Android SDK Build-Tools 34.0.0+
   - Android SDK Command-line Tools
   - Physical Android device with USB Debugging enabled (or Android Virtual Device / AVD)

---

## Step 1: Install Dependencies & Build Web Assets

Inside `scratch/aegis-app`:

```bash
# Install node dependencies
npm install

# Build the optimized production bundle into dist/
npm run build
```

---

## Step 2: Initialize the Android Native Project

Run the following commands to add the Android platform and synchronize assets:

```bash
# 1. Add Android native platform (only needed once)
npx cap add android

# 2. Copy the web assets from dist/ into the native Android project
npx cap copy

# 3. Synchronize Capacitor plugins & native code
npx cap sync
```

This creates the `android/` directory containing a standard Gradle-based Android Studio project.

---

## Step 3: Configure Android Permissions

Ensure the following permissions are present inside `android/app/src/main/AndroidManifest.xml` within `<manifest>`:

```xml
<!-- Camera for optical lateral strip and pupil scan -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />

<!-- GPS Geolocation for incident tagging and 108 Emergency location -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />

<!-- Direct Phone Call for 108 Ambulance and 100 Police -->
<uses-permission android:name="android.permission.CALL_PHONE" />

<!-- Haptics / Vibration feedback -->
<uses-permission android:name="android.permission.VIBRATE" />

<!-- Local Notifications & Alerts -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Network & Bluetooth Telemetry -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
```

---

## Step 4: Open in Android Studio & Run

Your Android Studio is installed at:
`D:\Android\Android Studio\bin\studio64.exe`

The environment variable `CAPACITOR_ANDROID_STUDIO_PATH` has been configured to point to `D:\Android\Android Studio\bin\studio64.exe`.

You can open the project in Android Studio at any time with:

```bash
npx cap open android
```

Or manually open Android Studio from `D:\Android\Android Studio` and select the folder:
`C:\Users\sanjai vishal\.gemini\antigravity\scratch\aegis-app\android`

### Inside Android Studio:
1. Wait for Android Studio to complete the initial **Gradle Sync**.
2. Select your connected Android phone (with USB Debugging enabled) or an Android Virtual Device (AVD).
3. Click the green **Run (▶)** button or press `Shift + F10`.
4. The application will compile and launch directly on the device.

---

## Step 5: Generating a Debug APK (Command Line)

You can build a Debug APK directly from the terminal without opening Android Studio:

### Windows (PowerShell / Command Prompt):
```powershell
cd android
.\gradlew assembleDebug
```

### Linux / macOS:
```bash
cd android
./gradlew assembleDebug
```

The compiled Debug APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```
Install this APK onto any device via ADB:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Step 6: Generating a Release APK and AAB (Google Play)

### 1. Generate a Keystore
```bash
keytool -genkey -v -keystore field-screening-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias field-key
```

### 2. Configure Signing in `android/app/build.gradle`
```groovy
android {
    ...
    signingConfigs {
        release {
            storeFile file("../../field-screening-key.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD") ?: "YOUR_KEYSTORE_PASSWORD"
            keyAlias "field-key"
            keyPassword System.getenv("KEY_PASSWORD") ?: "YOUR_KEY_PASSWORD"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Build Signed Release APK
```bash
cd android
.\gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

### 4. Build Signed Android App Bundle (AAB for Google Play)
```bash
cd android
.\gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Summary of Useful Commands

| Task | Command |
|---|---|
| Build web app | `npm run build` |
| Add Android platform | `npx cap add android` |
| Sync web & plugins | `npx cap sync` |
| Open Android Studio | `npx cap open android` |
| Build Debug APK | `cd android && .\gradlew assembleDebug` |
| Build Release APK | `cd android && .\gradlew assembleRelease` |
| Build Google Play AAB | `cd android && .\gradlew bundleRelease` |

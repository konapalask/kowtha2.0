# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Keep document picker classes
-keep class io.github.react_native_documents_picker.** { *; }
-keep class com.reactnativedocumentpicker.** { *; }
-dontwarn io.github.react_native_documents_picker.**
-dontwarn com.reactnativedocumentpicker.**

# Keep React Native classes
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**

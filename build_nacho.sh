rm /Users/nacho/sites/wip-mob/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
ionic cordova build android --prod --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks /Users/nacho/sites/wip-mob/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk  dff
rm /Users/nacho/sites/wip-mob/platforms/android/app/build/outputs/apk/release/dff.apk
~/Library/Android/sdk/build-tools/28.0.3/zipalign -v 4 /Users/nacho/sites/wip-mob/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk /Users/nacho/sites/wip-mob/platforms/android/app/build/outputs/apk/release/dff.apk

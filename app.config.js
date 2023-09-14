const commonConfig = {
  name: "Relipos eMenu",
  slug: "relipos-EmenuV4",
  privacy: "public",
  platforms: [
    "ios",
    "android",
    "web"
  ],
    version: "2.8",
    orientation: "landscape",
    icon: "./assets/Customer/Logo.png",
    splash: {
      image: "./assets/Customer/Logo1.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "buildNumber": "3",
      "infoPlist": {
        "supportsTablet": true,
        "NSLocationAlwaysUsageDescription": "needs gps data.",
        "NSLocationWhenInUseUsageDescription": "Emenu need your location to suggest nearest restaurant for you. Please allow Relipos.Emenu access your location!",
        "NSAppTransportSecurity": {
          "NSExceptionDomains": {
            "demo.relipos.com": {
              "NSTemporaryExceptionAllowsInsecureHTTPLoads": true,
              "NSExceptionAllowsInsecureHTTPLoads": true,
              "NSExceptionRequiresForwardSecrecy": false,
              "NSExceptionMinimumTLSVersion": "TLSv1.1",
              "NSIncludesSubdomains": true
            },
            "relipos.com": {
              "NSTemporaryExceptionAllowsInsecureHTTPLoads": true,
              "NSExceptionAllowsInsecureHTTPLoads": true,
              "NSExceptionRequiresForwardSecrecy": false,
              "NSExceptionMinimumTLSVersion": "TLSv1.1",
              "NSIncludesSubdomains": true
            }
          },
          "NSAllowsArbitraryLoads": true,
          "NSAllowsArbitraryLoadsForMedia": true,
          "NSAllowsArbitraryLoadsInWebContent": true,
          "NSExceptionAllowsInsecureHTTPLoads": true,
          "NSAllowsLocalNetworking": true,
          "NSIncludesSubdomains": true
        }
      },
      "supportsTablet": true,
      bundleIdentifier: "com.relipos.Emenu"
    },
    android: {
      versionCode: 47,
      package: "com.relipos.Emenu",
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "CAMERA",
        "MANAGE_DOCUMENTS",
        "READ_CONTACTS",
        "READ_CALENDAR",
        "WRITE_CALENDAR",
        "READ_EXTERNAL_STORAGE",
        "USE_FINGERPRINT",
        "VIBRATE",
        "WAKE_LOCK",
        "WRITE_EXTERNAL_STORAGE",
        "com.anddoes.launcher.permission.UPDATE_COUNT",
        "com.android.launcher.permission.INSTALL_SHORTCUT",
        "com.google.android.c2dm.permission.RECEIVE",
        "com.google.android.gms.permission.ACTIVITY_RECOGNITION",
        "com.google.android.providers.gsf.permission.READ_GSERVICES",
        "com.htc.launcher.permission.READ_SETTINGS",
        "com.htc.launcher.permission.UPDATE_SHORTCUT",
        "com.majeur.launcher.permission.UPDATE_BADGE",
        "com.sec.android.provider.badge.permission.READ",
        "com.sec.android.provider.badge.permission.WRITE",
        "com.sonyericsson.home.permission.BROADCAST_BADGE"
      ]
    },
    "description": "New Version",
    "extra": {
      "eas": {
        "projectId": "51ced16b-2562-41bf-8cfd-e4c8c12e1dce"
      }
    }
  
};

module.exports = () => {
  if (process.env.APP_ENV === "production") {
    return {
      ...commonConfig
    };
  } else if (process.env.APP_ENV === "staging") {
    return {
      ...commonConfig
    };
  } else {
    return {
      ...commonConfig
    };
  }
};
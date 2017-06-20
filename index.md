WonderPush Web SDK plugin to automatically present the user a prompt for push permission with a configurable trigger.

The browser push permission prompt will be shown without any previous message.

You should probably prefer using the [optin-dialog](https://github.com/wonderpush/wonderpush-webplugin-optin-dialog)
plugin instead of this one.

Note that this plugin may not work properly if the user is not browsing directly on your own custom domain.
See: [Chrome Platform Status – Remove Usage of Notifications from iFrames (deprecated)](https://www.chromestatus.com/feature/6451284559265792).

# How to use this plugin

## From the WonderPush dashboard

Log in to your [WonderPush dashboard](https://dashboard.wonderpush.com/) and head over to the _Settings / Configuration_ page in the left menu.
Select the _Website_ tab and use this plugin.

## From the initialization options of the SDK

Change your call to `WonderPush.init()` to include the following, merging existing keys as necessary:

```javascript
WonderPush.init({
  plugins: {
    "optin-automatic": {
      "triggers": {
        // Configure the triggers as desired
      },
    },
  },
});
```

You can find the reference of the options in the {@link OptinAutomatic.Options} section of the reference.

# Reference

The available options are described in the {@link OptinAutomatic.Options} section of the reference.

The available API is described on the {@link OptinAutomatic} class.

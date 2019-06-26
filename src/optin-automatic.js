/**
 * WonderPush Web SDK plugin to automatically present the user a prompt for push permission with a configurable trigger.
 * @class OptinAutomatic
 * @param {external:WonderPushPluginSDK} WonderPushSDK - The WonderPush SDK instance provided automatically on intanciation.
 * @param {OptinAutomatic.Options} options - The plugin options.
 */
/**
 * @typedef {Object} OptinAutomatic.Options
 * @property {external:WonderPushPluginSDK.TriggersConfig} [triggers] - The triggers configuration for this plugin.
 */
/**
 * The WonderPush JavaScript SDK instance.
 * @external WonderPushPluginSDK
 * @see {@link https://wonderpush.github.io/wonderpush-javascript-sdk/latest/WonderPushPluginSDK.html|WonderPush JavaScript Plugin SDK reference}
 */
/**
 * WonderPush SDK triggers configuration.
 * @typedef TriggersConfig
 * @memberof external:WonderPushPluginSDK
 * @see {@link https://wonderpush.github.io/wonderpush-javascript-sdk/latest/WonderPushPluginSDK.html#.TriggersConfig|WonderPush JavaScript Plugin SDK triggers configuration reference}
 */
WonderPush.registerPlugin('optin-automatic', function OptinAutomatic(WonderPushSDK, options) {
  if (WonderPushSDK.waitTriggers) { // WonderPush SDK 1.1.18.0 or above
    WonderPushSDK.waitTriggers(options.triggers).then(function() {
      WonderPushSDK.setNotificationEnabled(true);
    });
  } else {
    WonderPushSDK.checkTriggers(options.triggers, function() {
      WonderPushSDK.setNotificationEnabled(true);
    });
  }
});

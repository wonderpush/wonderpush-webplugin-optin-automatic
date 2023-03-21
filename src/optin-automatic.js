/**
 * WonderPush Web SDK plugin to automatically present the user a prompt for push permission with a configurable trigger.
 * @class OptinAutomatic
 * @param {external:WonderPushPluginSDK} WonderPushSDK - The WonderPush SDK instance provided automatically on intanciation.
 * @param {OptinAutomatic.Options} options - The plugin options.
 */
/**
 * @typedef {Object} OptinAutomatic.Options
 * @property {external:WonderPushPluginSDK.TriggersConfig} [triggers] - The triggers configuration for this plugin.
 * @property {string} [message] - The dialog message.
 * @property {string} [positiveButton] - The dialog positive button message.
 * @property {string} [negativeButton] - The dialog negative button message.
 * @property {string} [icon] - The dialog icon URL. Defaults to the default notification icon configured in the project.
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
WonderPush.registerPlugin('optin-automatic',
  /**
   * @param {OptinAutomatic.Options} options
   */
  function OptinAutomatic(WonderPushSDK, options) {
  var catchRegistrationErrors = function(error) {
    if (error instanceof WonderPush.Errors.UserCancellationError || error instanceof WonderPush.Errors.PermissionError) {
      console.warn(error);
      return;
    }
    console.error(error);
  };
  var isMobile = navigator.userAgent.startsWith('Mozilla/5.0 (Linux; Android');
  if (isMobile) {
    WonderPushSDK.loadStylesheet('style.css');
  }
  WonderPushSDK.waitTriggers(options.triggers).then(function() {
    if (!isMobile) {
      WonderPushSDK.subscribeToNotifications().catch(catchRegistrationErrors);
      return;
    }
    // Do not show when user already subscribed, denied permission or doesn't support subscription
    if (window.WonderPush) {
      var subscriptionState = window.WonderPush.Notification.getSubscriptionState();
      if (subscriptionState === window.WonderPush.SubscriptionState.SUBSCRIBED || subscriptionState === window.WonderPush.SubscriptionState.UNSUPPORTED || subscriptionState === window.WonderPush.SubscriptionState.DENIED) {
        return;
      }
    }
    var translations = {
      "fr": {
        "We'd like to show you notifications for the latest news and updates.": "Recevoir les notifications pour être tenu informé des dernières nouveautés.",
        "Cancel": "Refuser",
        "Allow": "Accepter",
      },
      // "es": {
      //   "We'd like to show you notifications for the latest news and updates.": "Recibir notificaciones de las últimas novedades.",
      //   "Cancel": "Cancelar",
      //   "Allow": "Permitir",
      // },
      // "it": {
      //   "We'd like to show you notifications for the latest news and updates.": "Vorremmo mostrarti le notifiche per le ultime notizie e gli aggiornamenti.",
      //   "Cancel": "Annulla",
      //   "Allow": "Permettere",
      // },
      // "de": {
      //   "We'd like to show you notifications for the latest news and updates.": "Wir möchten Ihnen Benachrichtigungen für die neuesten Nachrichten und Updates anzeigen.",
      //   "Cancel": "Stornieren",
      //   "Allow": "Erlauben",
      // },
      // "pt": {
      //   "We'd like to show you notifications for the latest news and updates.": "Gostaríamos de mostrar notificações para as últimas notícias e atualizações.",
      //   "Cancel": "Cancelar",
      //   "Allow": "Permitir",
      // },
      // "nl": {
      //   "We'd like to show you notifications for the latest news and updates.": "We willen je graag meldingen laten zien voor het laatste nieuws en updates.",
      //   "Cancel": "Annuleren",
      //   "Allow": "Toestaan",
      // },
      // "pl": {
      //   "We'd like to show you notifications for the latest news and updates.": "Chcielibyśmy wyświetlać powiadomienia o najnowszych wiadomościach i aktualizacjach.",
      //   "Cancel": "Anulować",
      //   "Allow": "Umożliwić",
      // },
    };
    var locales = WonderPushSDK.getLocales ? WonderPushSDK.getLocales() || [] : [];
    var language = locales.map(function(x) { return x.split(/[-_]/)[0]; })[0] || (navigator.language || '').split('-')[0];
    /**
     * Translates the given text
     * @param text
     * @returns {*}
     */
    var _ = function (text) {
      if (translations.hasOwnProperty(language) && translations[language][text]) return translations[language][text];
      return text;
    };
    var container = document.createElement('div');
    container.className = 'wp-slidedown-container ' + (window.matchMedia('only screen and (min-width : 600px)').matches ? 'wp-slide-down' : 'wp-slide-up');
    container.id = 'wp-slidedown-container';
    container.innerHTML = '<div id="wp-slidedown-dialog" class="wp-slidedown-dialog"><div><div class="wp-slidedown-body" id="wp-slidedown-body"><div class="wp-slidedown-body-icon"></div><div class="wp-slidedown-body-message"></div><div class="wp-clearfix"></div></div><div class="wp-slidedown-footer" id="wp-slidedown-footer"><button class="wp-align-right wp-primary wp-slidedown-button" id="wp-slidedown-allow-button"></button><button class="wp-align-right wp-secondary wp-slidedown-button" id="wp-slidedown-cancel-button"></button><div class="wp-clearfix"></div></div></div></div>';
    var dismiss = function() {
      container.classList.add('wp-close-slidedown');
      setTimeout(function() {
        if (container.parentNode) container.parentNode.removeChild(container);
      }, 400);
    };
    var iconSrc = options.icon || WonderPushSDK.getNotificationIcon();
    var iconContainer = container.querySelector('.wp-slidedown-body-icon');
    if (iconSrc && iconContainer) {
      var img = document.createElement('img');
      img.src = iconSrc;
      iconContainer.appendChild(img);
    } else if (iconContainer) {
      iconContainer.parentNode.removeChild(iconContainer);
    }
    var messageContainer = container.querySelector('.wp-slidedown-body-message');
    if (messageContainer) {
      messageContainer.innerText = options.message || _("We'd like to show you notifications for the latest news and updates.");
    }
    var cancelButton = container.querySelector('#wp-slidedown-cancel-button');
    if (cancelButton) {
      cancelButton.innerText = options.negativeButton || _("Cancel");
      cancelButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        dismiss();
      });
    }
    var allowButton = container.querySelector('#wp-slidedown-allow-button');
    if (allowButton) {
      allowButton.innerText = options.positiveButton || _("Allow");
      allowButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        dismiss();
        WonderPushSDK.subscribeToNotifications().catch(catchRegistrationErrors);
      });
    }
    document.body.appendChild(container);
  });
});

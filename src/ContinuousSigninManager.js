import Log from './Log';
import UserManager from './UserManager';
import AutomaticRenewStyle from './AutomaticRenewStyle'

export default class ContinuousSignInManager {
    constructor(settings = {},
        AutomaticRenewServiceCtor,
        SessionMonitorCtor,
        TokenRevocationClientCtor
    ) {
        settings.defaultAutomaticRenewStyle = AutomaticRenewStyle.silentAndInteractive;
        this._userManager = new UserManager(settings, AutomaticRenewServiceCtor, SessionMonitorCtor, TokenRevocationClientCtor);
        this._initialized = false;
    }

    get userManager() {
        return this._userManager;
    }

    initialize() {
        return this._userManager.getUser().then(user => {
            if (user && !user.expired) {
                Log.debug("a valid user was found on AlwaysSignedInUserManager initialization: " + user.profile.sub);
                return user;
            } else {
                this._userManager.signinSilent().then(user => {
                    Log.info("authentication was performed silently on AlwaysSignedInUserManager initialization. User: " + user.profile.sub);
                    return user;
                }, err => {
                    Log.info("signinSilent has failed on AlwaysSignedInUserManager initialization. Falling back to signinRedirect. Failure: " + err);
                    this._userManager.signinRedirect().then(() => {
                        Log.info("redirecting to identity provider");
                    }, err => {
                        Log.error("on AlwaysSignedInUserManager initialization, signinRedirect has failed. Any subsequent API call might fail to authenticate itself. Failure: " + err);
                        throw err;
                    });
                });
            }
        }).then(user => {
            if (user) {
                this._initialized = true;
            }
            return user;
        })
    }

    getUser() {
        let promise = this._userManager.getUser();
        if (this._initialized) {
            promise = promise.then(user => {
                if (user && !user.expired) {
                    return user;
                } else {
                    Log.info("user not found in storage, invoking signin process");
                    return this._userManager.signinSilentThenPopup();
                }
            });
        }
        return promise;
    }
}
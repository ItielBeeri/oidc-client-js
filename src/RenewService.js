import Log from './Log';

export default class RenewService {

    constructor(userManager) {
        if (this.constructor === RenewService) {
            throw new TypeError("RenewService is an abstraction and cannot be instanciated.");
        }
        if (this._tokenExpiring === undefined) {
            throw new TypeError("RenewService's inheritors must implement _tokenExpiring callback.");
        }

        this._userManager = userManager;
    }

    start() {
        if (!this._callback) {
            this._callback = this._tokenExpiring.bind(this);
            this._userManager.events.addAccessTokenExpiring(this._callback);

            // this will trigger loading of the user so the expiring events can be initialized
            this._userManager.getUser();
        }
    }

    stop() {
        if (this._callback) {
            this._userManager.events.removeAccessTokenExpiring(this._callback);
            delete this._callback;
        }
    }
}

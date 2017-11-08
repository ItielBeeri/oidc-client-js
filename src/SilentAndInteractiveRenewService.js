import Log from './Log';
import RenewService from './RenewService'

export default class SilentAndInteractiveRenewService extends RenewService {

    constructor(userManager) {
        super(userManager);
    }

    _tokenExpiring() {
        Log.debug("SilentAndInteractiveRenewService automatically renewing access token");
        this._userManager.signinSilentThenPopup();
    }
}

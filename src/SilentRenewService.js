// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import RenewService from './RenewService'

export default class SilentRenewService extends RenewService {

    constructor(userManager) {
        super(userManager);
    }

    _tokenExpiring() {
        Log.debug("SilentRenewService automatically renewing access token");
        
        this._userManager.signinSilent().then(user => {
            Log.debug("Silent token renewal successful");
        }, err => {
            Log.error("Error from signinSilent:", err.message);
            this._userManager.events._raiseSilentRenewError(err);
        });
    }
}

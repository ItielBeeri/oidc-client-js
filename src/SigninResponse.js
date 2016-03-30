import Log from './Log';
import UrlUtility from './UrlUtility';
import ErrorResponse from './ErrorResponse';

export default class SigninResponse {
    constructor(url) {
        
        var values = UrlUtility.parseUrlFragment(url, "#");
        
        if (values.error){
            return new ErrorResponse(values);
        }
        
        this.state = values.state;
        this.id_token = values.id_token;
        this.session_state = values.session_state;
        this.access_token = values.access_token;
        this.token_type = values.token_type;
        this.scope = values.scope;
        
        let expires_in = parseInt(values.expires_in);
        if (typeof expires_in === 'number' && expires_in > 0){
            let now = parseInt(Date.now() / 1000);
            this.expires_at = now + expires_in;
        }
    }
    
    get expires_in(){
        if (this.expires_at){
            let now = parseInt(Date.now() / 1000);
            return this.expires_at - now;
        }
        return undefined;
    }
}
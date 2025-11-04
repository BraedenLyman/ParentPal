function authenticate(helper, paramsValues, credentials) {
    var HttpRequestHeader = Java.type('org.parosproxy.paros.network.HttpRequestHeader');
    var HttpHeader = Java.type('org.parosproxy.paros.network.HttpHeader');
    var URI = Java.type('org.apache.commons.httpclient.URI');

    var FIREBASE_API_KEY = paramsValues.get("firebase_api_key");
    var email = credentials.getParam("email");
    var password = credentials.getParam("password");

    print("Authenticating user: " + email);

    var firebaseAuthUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + FIREBASE_API_KEY;
    var authPayload = JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
    });

    var msg = helper.prepareMessage();
    var requestUri = new URI(firebaseAuthUrl, false);
    var requestHeader = new HttpRequestHeader(HttpRequestHeader.POST, requestUri, HttpHeader.HTTP11);

    requestHeader.setHeader(HttpHeader.CONTENT_TYPE, "application/json");
    requestHeader.setHeader(HttpHeader.CONTENT_LENGTH, authPayload.length);

    msg.setRequestHeader(requestHeader);
    msg.setRequestBody(authPayload);

    helper.sendAndReceive(msg);

    var responseBody = msg.getResponseBody().toString();
    print("Firebase auth response: " + responseBody);

    var authResponse = JSON.parse(responseBody);

    if (authResponse.idToken) {
        var idToken = authResponse.idToken;
        print("Successfully authenticated. ID Token obtained.");

        var backendUrl = paramsValues.get("backend_url") + "/api/sign-in";
        var backendPayload = JSON.stringify({
            idToken: idToken
        });

        var backendMsg = helper.prepareMessage();
        var backendUri = new URI(backendUrl, false);
        var backendHeader = new HttpRequestHeader(HttpRequestHeader.POST, backendUri, HttpHeader.HTTP11);

        backendHeader.setHeader(HttpHeader.CONTENT_TYPE, "application/json");
        backendHeader.setHeader(HttpHeader.CONTENT_LENGTH, backendPayload.length);

        backendMsg.setRequestHeader(backendHeader);
        backendMsg.setRequestBody(backendPayload);

        helper.sendAndReceive(backendMsg);

        var backendResponse = backendMsg.getResponseBody().toString();
        print("Backend sign-in response: " + backendResponse);

        var sessionToken = helper.getHttpState().getToken();
        if (sessionToken != null) {
            sessionToken.setValue(idToken);
        }

        return backendMsg;
    } else {
        print("Authentication failed: " + responseBody);
        return null;
    }
}

function getRequiredParamsNames() {
    return ["firebase_api_key", "backend_url"];
}

function getOptionalParamsNames() {
    return [];
}

function getCredentialsParamsNames() {
    return ["email", "password"];
}

function isLoggedIn(msg) {
    var responseBody = msg.getResponseBody().toString();
    var responseHeader = msg.getResponseHeader().toString();

    if (responseBody.indexOf('"user"') > -1 && responseBody.indexOf('"account_id"') > -1) {
        print("User is logged in");
        return true;
    }

    if (responseBody.indexOf('sign-in') > -1 || responseHeader.indexOf('sign-in') > -1) {
        print("User is not logged in - redirected to sign-in");
        return false;
    }

    return true;
}

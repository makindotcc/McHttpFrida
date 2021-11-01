Java.perform(function () {
    /** 
     * Like okhttp docs says:
     * "This is the last interceptor in the chain. It makes a network call to the server."
     */
    const CallServerInterceptor = Java.use("com.kv5"); // okhttp3.internal.http.CallServerInterceptor

    function interceptResponse(response) {
        let responseBody = response.d(1024 * 128); // okhttp3.ResponseBody::peekBody(byteCount: Long)

        send("[<] response intercepted: " + JSON.stringify(response.toString()));
        if (responseBody != null) {
            let responseBodyString = responseBody.f();
            if (responseBodyString == "") {
                send("    empty response body");
            } else {
                send(" body: " + responseBodyString.trim());
            }
            send("\n\n");
        }
    }
    
    CallServerInterceptor.intercept.implementation = function(chain) {
        let response = this.intercept(chain);
        interceptResponse(response);
        return response;
    }
});

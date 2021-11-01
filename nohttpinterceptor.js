Java.perform(function () {
    /** 
     * Like okhttp docs says:
     * "This is the last interceptor in the chain. It makes a network call to the server."
     */
    const CallServerInterceptor = Java.use("com.kv5"); // okhttp3.internal.http.CallServerInterceptor
    const RealInterceptorChain = Java.use("com.pv5"); // okhttp3.internal.http.RealInterceptorChain

    function interceptRequest(request) {
        send("[>] request intercepted:\n" + request.toString() + "\n\n");
    }

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
        // f - obfuscated name of "request" field
        let request = Java.cast(chain, RealInterceptorChain).f.value;
        interceptRequest(request);

        let response = this.intercept(chain);
        interceptResponse(response);
        return response;
    }
});

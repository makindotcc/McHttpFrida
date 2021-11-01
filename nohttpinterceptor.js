Java.perform(function () {
    /** 
     * Like okhttp docs says:
     * "Bridges from application code to network code."
     * So this is a good place to place hehe some hook.
     */
    const BridgeInterceptor = Java.use("com.jv5"); // okhttp3.internal.http.BridgeInterceptor
    const Buffer = Java.use("okio.Buffer");

    function interceptRequest(request) {
        // request == com.xt5
        let requestUrl = request._b.value.toString();
        send("[>] request intercepted: " + requestUrl);

        let requestBody = request.e.value;
        if (requestBody != null) {
            let buffer = Buffer.$new();
            // okhttp3.RequestBody::writeTo(sink: BufferedSink)
            requestBody.c(buffer);

            // Buffer::readUtf8(): String
            let requestBodyStr = buffer.n();
            if (requestBodyStr != "") {
                send(" > body: " + requestBodyStr);
            }
        }
        send("\n");
    }

    function interceptResponse(response) {
        send("[<] response intercepted: " + JSON.stringify(response.toString()));

        let responseBody = response.d(1024 * 128); // okhttp3.Response::peekBody(byteCount: Long)
        if (responseBody != null) {
            let responseBodyString = responseBody.f();
            if (responseBodyString != "") {
                send(" < body: " + responseBodyString);
            }
        }
        send("\n");
    }

    BridgeInterceptor.intercept.implementation = function(chain) {
        // d - obfuscated name of "request" getter
        let request = chain.d();
        interceptRequest(request);

        let response = this.intercept(chain);

        interceptResponse(response);
        return response;
    }
});

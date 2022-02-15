Java.perform(function () {
    const showHeaders = true;

    const Request = Java.use("com.fz5"); // okhttp3.Request
    Request.getMethod = (r) => r.c.value;
    Request.getUrl = (r) => r._b.value;
    Request.getHeaders = (r) => r.d.value;
    Request.getBody = (r) => r.e.value;

    const Response = Java.use("com.jz5"); // okhttp3.Response
    Response.getHeaders = (r) => r.B0.value;

    /** 
     * Like okhttp docs says:
     * "Bridges from application code to network code."
     * So this is a good place to place hehe some hook.
     */
    const BridgeInterceptor = Java.use("com.r06"); // okhttp3.internal.http.BridgeInterceptor
    const Buffer = Java.use("okio.Buffer");

    function formatHeaders(headers) {
        return headers.toString();
    }

    function interceptRequest(request) {
        let requestMethod = Request.getMethod(request);
        let requestUrl = Request.getUrl(request).toString();
        send(`[>] request intercepted: method=${requestMethod} url=${requestUrl}`);

        if (showHeaders) {
            send(" > headers:\n" + formatHeaders(Request.getHeaders(request)));
        }

        let requestBody = Request.getBody(request);
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

        if (showHeaders) {
            send(" < headers:\n" + formatHeaders(Response.getHeaders(response)));
        }

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

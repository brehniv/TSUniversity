(function (global) {
    const ajaxUtils = {};

    function getRequestObject() {
        return global.XMLHttpRequest ? new XMLHttpRequest() : null;
    }

    ajaxUtils.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
        const request = getRequestObject();
        if (!request) {
            global.alert("Ajax is not supported!");
            return;
        }
        request.onreadystatechange = function () {
            handleResponse(request, responseHandler, isJsonResponse);
        };
        request.open("GET", requestUrl, true);
        request.send(null);
    };

    function handleResponse(request, responseHandler, isJsonResponse) {
        if (request.readyState === 4 && request.status === 200) {
            if (isJsonResponse === undefined) {
                isJsonResponse = true;
            }
            responseHandler(isJsonResponse ? JSON.parse(request.responseText) : request.responseText);
        }
    }

    global.$ajaxUtils = ajaxUtils;
})(window);

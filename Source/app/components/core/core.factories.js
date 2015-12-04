(function() {
    angular.module('listwidget.core')
        .factory('urlfactory', urlfactory);

    urlfactory.$inject = ['$location'];

    function urlfactory($location) {
        // reference to service for callbacks
        var __service = this,
            parts = {
                "queryvars": {}
            },
            absUrl = $location.absUrl(),
        // extract and parse url
            elements = absUrl.split("?");


        if (!angular.isUndefined(elements) && elements.length > 1) {
            parts["queryString"] = elements[1];
            if (elements[1]) {
                parts["hashString"] = (parts["queryString"].split("#"))[1];
                parts["requestParams"] = ((parts["queryString"].split("#"))[0]).split("&");

                parts["requestParams"].forEach(function (queryStringVariable) {
                    var __variable = queryStringVariable.split("=");
                    parts.queryvars[__variable[0]] = __variable[1];
                });
            }
            else {
               // $state.go('error');
            }
            // url
            parts["url"] = elements[0];
        }

        var service = {
            getQueryStringVar : getQueryStringVar,
            createQueryStringEle : createQueryStringEle
        }
        return service;

        function getQueryStringVar(variable) {

            if (parts.queryvars[variable] !== "undefined") {
                return parts.queryvars[variable];
            }
            return false;
        }

        function createQueryStringEle(crds) {

                var crdString = '';
                if (!angular.isUndefined(crds) && crds[0] !== '') {
                    crdString += '+AND+(';
                    angular.forEach(crds, function (value, key) {
                        if (key != 0) {
                            crdString += '+OR+';
                        }
                        crdString += 'ac_current_employ_id:' + value;
                    })
                    return crdString + ')';
                }
                else {
                    console.info("iFrame parameter must supply at least one CRD number. Returning for all CRDs.");
                }
                return crdString;
            }
    }

})()
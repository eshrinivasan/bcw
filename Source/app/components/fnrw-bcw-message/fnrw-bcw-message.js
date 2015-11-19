(function() {
    angular.module('BCWidgetApp.message', ['FinraDataServices', 'ui.router', 'ngSanitize'])
        .config(function ($provide) {
            $provide.decorator('$exceptionHandler', ['$log', '$delegate',
                function ($log, $delegate) {
                    return function (exception, cause) {
                        $delegate(exception, cause);
                        $log.error('exception: ' + exception + ' ; cause:' + cause);

                    };
                }
            ]);
        })
        .controller('MessageCtrl', ['$scope', 'urlService', '$state', function ($scope, urlService, $state) {
            var fname = urlService.getQueryStringVar('firmname');

            if (fname) {
                $scope.firmname = decodeURI(urlService.getQueryStringVar('firmname'));
             }
            else {
                $scope.firmname = ' ';
            }
        }])
        .controller('ErrorMessageCtrl', function () {

        });
})()
(function() {
    angular.module('listwidget.list')
        .controller("ScrollController", ScrollController)
        .directive("preserveScroll", function preserveScroll($window, $timeout){
            return {
                restrict: 'AE',
                controller: 'ScrollController',
                link: function(scope, element, attr, sctrl) {

                    scope.scrollPos = {};

                    $(element).on("scroll", function() {
                       // console.log(this.scrollTop);
                        scope.scrollPos.offset = this.scrollTop;
                        console.log(scope.scrollPos.offset);

                        sctrl.setPosition(scope.scrollPos.offset);
                        scope.$apply();

                    });

                }
            }

        });

    ScrollController.$inject = ['$rootScope', '$window', '$element'];
    function ScrollController($rootScope, $window, $element) {
        var scroll = this;
        scroll.setPosition = setPosition;
        scroll.getPosition = getPosition;
        //scroll.offset = 0;

        console.log($element);
        $element.scrollTop = scroll.getPosition();
        function getPosition() {
            return $rootScope.offset;
        }

        function setPosition(offset) {
            $rootScope.offset = offset;
        }

    }


})()
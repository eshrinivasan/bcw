(function() {
    'use strict';
    angular.module('pdwidget.stickyscroll')
        .directive('stickyScroll', stickyScroll);

        stickyScroll.$inject = [];

        function stickyScroll() {
                return {
                    restrict: 'A',
                    controller: function($scope, $element){

                    },
                    link: function(scope, element, attr){

                            attr.$observe('stickyScrollPosition', function (value) {
                                if (value) {
                                    angular.element(element).mCustomScrollbar('scrollTo', value);
                                }
                            });
                        }
                    }
        }
})();
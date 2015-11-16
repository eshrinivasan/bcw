angular.module('FinraHelperUtils', [])
.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                if(element.attr("class") == attrs.toggleClass.remove) {
                    element.removeClass(attrs.toggleClass.remove);
                    element.addClass(attrs.toggleClass.add);
                } else {
                    element.addClass(attrs.toggleClass.add);
                }
            });
        }
    };
});
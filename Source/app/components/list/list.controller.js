(function() {
    angular.module('listwidget.list')
        .controller('ListController', ListController);

    ListController.$inject = ['$scope',
        '$state',
        'dataservice',
        'itemshareservice',
        '$window',
        '$rootScope',
        '$analytics'];

    function ListController($scope,
                            $state,
                            dataservice,
                            itemshareservice,
                            $window,
                            $rootScope,
                            $analytics) {
        var listCtl = this;
        listCtl.getFullName = getFullName;
        listCtl.getLocations = getLocations;
        listCtl.select = select;
        listCtl.goToSite = goToSite;
        listCtl.element = '';




        $scope.scrollConfig = {
            autoHideScrollbar: false,
            theme: 'light',
            advanced:{
                updateOnContentResize: true
            },

            scrollbarPosition: 'inside',
            scrollInertia: 100,
            alwaysShowScrollbar: 2,
            mousewheel : {
                enable : true,
                scrollAmount : 30
            },
            keyboard : {
                enable : true
            },
            contentTouchScroll : 25,
            documentTouchScroll : true,
            callbacks:{
            onScroll: function(){
                var scrollPosition = 0;
                scrollPosition = this.mcs.top;
                itemshareservice.setScrollPos(scrollPosition);
            }
        }


        };

        $scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {

            if (toState.name === 'list' && fromState.name === 'detail') {
                var data = itemshareservice.getScrollPos();
             //   var item = shareselecteditem.getItem();
                $scope.scrollPosition = data;
                console.log($scope.scrollPosition);
             //   $scope.selected = item.value;

            }

        });
        function goToSite(url) {
            $window.open(url);
        }
        function select(item, event, index) {
            itemshareservice.setItem(item);
            listCtl.element = event.currentTarget.id;
            $state.go('detail');
            $analytics.eventTrack('Click', {
                category: 'BCListItem', label:getFullName(item)
            });
        };

        function getFullName(item) {
            return dataservice.getFullName(item);
        }

        function getLocations(item) {
            return dataservice.getLocations(item);
        }


    }
})()
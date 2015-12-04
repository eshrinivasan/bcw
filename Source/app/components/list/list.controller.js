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
                            $analytics)  {
        var listCtl = this;

        listCtl.getFullName = getFullName;
        listCtl.getLocations = getLocations;
        listCtl.select = select;
        listCtl.goToSite = goToSite;
        listCtl.animeClass = 'fadeInLeft';
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
                enable : true
            },
            keyboard : {
                enable : true
            },
            contentTouchScroll : 25,
            documentTouchScroll : true

        };


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
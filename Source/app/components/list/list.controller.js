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
        $scope.isList = dataservice.isList();
        $scope.isDetail = dataservice.getCurrentState() === 'detail';
        $scope.state = $state.current.name;

        $scope.slideLeft = dataservice.slideLeft();

        $scope.jqueryScrollbarOptions = {
            "onScroll": function (y, x) {
                if (y.scroll == y.maxScroll) {

                }
            }
        };


        $rootScope.$on('$stateChangeSuccess', function (event) {
           // console.log($rootScope.offset);
           // $window.pageYOffset =  $rootScope.offset;
            //listCtl.scrollTo(listCtl.element);

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
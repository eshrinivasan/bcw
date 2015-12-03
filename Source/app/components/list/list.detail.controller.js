(function() {
    angular.module('listwidget.list')
        .controller('ListDetailController', ListDetailController);

    ListDetailController.$inject = ['$scope', '$stateParams', '$state', 'tooltips', 'externalUrls', 'dataservice', 'itemshareservice', '$window'];

    function ListDetailController($scope, $stateParams, $state, tooltips, externalUrls, dataservice, itemshareservice, $window) {
        var detailCtl = this;
        detailCtl.item = itemshareservice.getItem();
        detailCtl.bcIndUrl = externalUrls.bcIndUrl;
        detailCtl.iaIndUrl = externalUrls.iaIndUrl;
        detailCtl.brokerToolTip = tooltips.broker;
        detailCtl.iaToolTip = tooltips.investmentAdvisor;
        detailCtl.disclosureToolTip = tooltips.disclosure;
        $scope.state = $state.current.name;

        detailCtl.goBack = goBack;
        detailCtl.isBroker = isBroker;
        detailCtl.isInvestmentAdvisor = isInvestmentAdvisor;
        detailCtl.isBoth = isBoth;
        detailCtl.isNeither = isNeither;
        detailCtl.hasDisclosures = hasDisclosures;
        detailCtl.getFullName = getFullName;
        detailCtl.getLocations = getLocations;
        $scope.openFullReport = openFullReport;
        detailCtl.placement = placement;
        $scope.isList = dataservice.isList();
        $scope.isDetail = dataservice.getCurrentState() === 'detail';

        function placement(anchor) {
            return anchor.left < $window.width / 2 ? "right" : "left";
        };

          function goBack(state) {
              $state.go(state);
              //$window.history.back;
          };

        function isBroker(item) {

            return (item.fields.ac_bc_active_fl === "Y" && item.fields.ac_ia_active_fl !== "Y");
        };
        function isInvestmentAdvisor(item) {

            return (item.fields.ac_ia_active_fl === "Y" && item.fields.ac_bc_active_fl !== "Y");
        };
        function isBoth(item) {

            return (item.fields.ac_bc_active_fl === "Y" && item.fields.ac_ia_active_fl === "Y");

        };
        function isNeither(item) {

            return (item.fields.ac_bc_active_fl !== "Y" && item.fields.ac_ia_active_fl !== "Y");
        };
        function hasDisclosures(item) {

            return (item.fields.ac_bc_dsclr_fl === "Y" || item.fields.ac_ia_dsclr_fl === "Y");
        }
        function getFullName(item) {
            return dataservice.getFullName(item);
        }

        function getLocations(item) {
            return dataservice.getLocations(item);
        }
        function openFullReport(item) {
            var url = '';
            if (isBoth(item) || isBroker(item)) {
                url = externalUrls.bcIndUrl + item.fields.ac_source_id;
            }
            else if (isInvestmentAdvisor(item)) {
                url = externalUrls.iaIndUrl + item.fields.ac_source_id;
            }
            else {
                url = 'http://brokercheck.finra.org'
            }
            console.log(url);
            $window.open(url);
        }

    }
})()
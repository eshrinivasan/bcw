(function() {
    angular.module('listwidget.list')
        .controller('ListDetailController', ListDetailController);

    ListDetailController.$inject = ['$scope', '$stateParams', '$state', 'tooltips', 'externalUrls', 'dataservice', 'itemshareservice', '$window', '$analytics'];

    function ListDetailController($scope, $stateParams, $state, tooltips, externalUrls, dataservice, itemshareservice, $window, $analytics) {
        var detailCtl = this;
        detailCtl.item = itemshareservice.getItem();
        detailCtl.bcIndUrl = externalUrls.bcIndUrl;
        detailCtl.iaIndUrl = externalUrls.iaIndUrl;
        detailCtl.brokerToolTip = tooltips.broker;
        detailCtl.iaToolTip = tooltips.investmentAdvisor;
        detailCtl.disclosureToolTip = tooltips.disclosure;

        detailCtl.goBack = goBack;
        detailCtl.isBroker = isBroker;
        detailCtl.isInvestmentAdvisor = isInvestmentAdvisor;
        detailCtl.isBoth = isBoth;
        detailCtl.isNeither = isNeither;
        detailCtl.hasDisclosures = hasDisclosures;
        detailCtl.getFullName = getFullName;
        detailCtl.getLocations = getLocations;
        $scope.openFullReport = openFullReport;


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
            $window.open(url);

            $analytics.eventTrack('Click', {
                category: 'BCGetDetails', label: url
            });
        }

    }
})()
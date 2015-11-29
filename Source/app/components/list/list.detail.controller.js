(function() {
    angular.module('listwidget.list')
        .controller('ListDetailController', ListDetailController);

    ListDetailController.$inject = ['$scope', '$stateParams', '$state', 'tooltips', 'externalUrls', 'dataservice', 'itemshareservice', '$window'];

    function ListDetailController($scope, $stateParams, $state, tooltips, externalUrls, dataservice, itemshareservice, $window) {
        var vm = this;
        vm.item = itemshareservice.getItem();
        vm.bcIndUrl = externalUrls.bcIndUrl;
        vm.iaIndUrl = externalUrls.iaIndUrl;
        vm.brokerToolTip = tooltips.broker;
        vm.iaToolTip = tooltips.investmentAdvisor;
        vm.disclosureToolTip = tooltips.disclosure;
        vm.animeClass = 'slideInRight';

        vm.goBack = goBack;
        vm.isBroker = isBroker;
        vm.isInvestmentAdvisor = isInvestmentAdvisor;
        vm.isBoth = isBoth;
        vm.isNeither = isNeither;
        vm.hasDisclosures = hasDisclosures;
        vm.getFullName = getFullName;
        vm.getLocations = getLocations;
        vm.openFullReport = openFullReport;

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
        }

    }
})()
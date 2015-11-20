(function() {
    'use strict'
    angular.module('BCWidgetApp.list', ['ui.router', 'ngAnimate', 'FinraDataServices', 'ui.bootstrap'])
        .value('IAUrl', 'http://www.adviserinfo.sec.gov/IAPD/Support/IAPD_Summary_Link.aspx?Source=Widget&IndividualID=')
        .value('BCIndUrl', 'http://brokercheck.finra.org/Individual/Summary/')
        .controller('SolrSearchCtrl', ['$scope', '$state', 'itemShareService', 'bcNameService','locationService',
            function ($scope, $state, itemShareService, bcNameService, locationService) {

                $scope.itemDetail;
                $scope.empty = $scope.noresults;

                $scope.select = function (item) {
                    itemShareService.setItem(item);
                    $state.go('detail');
                };

                $scope.getFullName = function (item) {
                    bcNameService.setFullName(item);
                    return bcNameService.getFullName();
                };
                $scope.locations = function(item) {
                    return locationService.getLocations(item);
                }


            }])
        .controller('ItemDetailCtrl', ['$scope', 'itemShareService', '$state', 'bcNameService', 'IAUrl', 'BCIndUrl','locationService',
            function ($scope, itemShareService, $state, bcNameService, IAUrl, BCIndUrl, locationService) {
                $scope.item = itemShareService.getItem();

                $scope.BCUrl = BCIndUrl;
                $scope.IAIndUrl = IAUrl;

                $scope.brokerToolTip = "A broker, or registered representative, is a person who buys and sells securities—such as stocks, bonds or mutual funds—for a customer or for a securities firm.";
                $scope.iaToolTip = 'An investment adviser is an individual or company that is paid for providing advice about investments to their clients.';
                $scope.disclosureToolTip = 'All individuals registered to sell securities or provide investment advice are required to disclose customer complaints and arbitrations, regulatory actions, employment terminations, bankruptcy filings, and criminal or civil judicial proceedings.';

                $scope.goBack = function (state) {
                    $state.go(state);
                };


                $scope.getTarget = function () {
                    return 'http://brokercheck.finra.org/Individual/Summary/' + item.fields.ac_source_id;
                }
                $scope.isBroker = function (item) {
                    console.log(item);
                    return (item.fields.ac_bc_active_fl === "Y" && item.fields.ac_ia_active_fl !== "Y");
                };
                $scope.isInvestmentAdvisor = function (item) {
                    console.log(item);
                    return (item.fields.ac_ia_active_fl === "Y" && item.fields.ac_bc_active_fl !== "Y");
                };
                $scope.isBoth = function (item) {
                    console.log(item);
                    return (item.fields.ac_bc_active_fl === "Y" && item.fields.ac_ia_active_fl === "Y");

                };
                $scope.isNeither = function (item) {
                    console.log(item);
                    return (item.fields.ac_bc_active_fl !== "Y" && item.fields.ac_ia_active_fl !== "Y");
                };
                $scope.hasDisclosures = function (item) {
                    console.log(item);
                    return (item.fields.ac_bc_dsclr_fl === "Y" || item.fields.ac_ia_dsclr_fl === "Y");
                }
                $scope.getFullName = function (item) {
                    bcNameService.setFullName(item);
                    return bcNameService.getFullName();
                }
                $scope.getDestinationUrl = function (item) {
                    var url;
                    if (isInvestmentAdvisor(item)) {
                        return url = IAUrl + item.fields.ac_source_id;
                    }
                    else if (isBroker(item) || isBoth(item)) {
                        return url = BCIndUrl + item.fields.ac_source_id;
                    }
                    else {
                        throw "This individual is neither an investment advisor nor a broker."
                    }
                    return url;
                }
                $scope.locations = function(item) {
                    return locationService.getLocations(item);
                }

            }])


})()
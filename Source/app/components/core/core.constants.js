(function() {
    angular.module('listwidget.core')
        .constant('restConfig', { endpoint: 'http://doppler.finra.org/doppler-lookup/api/v1/lookup' })
        .constant('externalUrls',
                { bcIndUrl : 'http://brokercheck.finra.org/Individual/Summary/',
                  iaIndUrl : 'http://www.adviserinfo.sec.gov/IAPD/Support/IAPD_Summary_Link.aspx?Source=Widget&IndividualID='})
        .constant('tooltips',
                { broker: "A broker, or registered representative, is a person who buys and sells securities—such as stocks, bonds or mutual funds—for a customer or for a securities firm.",
                  investmentAdviser: 'An investment adviser is an individual or company that is paid for providing advice about investments to their clients.',
                  disclosure: 'All individuals registered to sell securities or provide investment advice are required to disclose customer complaints and arbitrations, ' +
                              'regulatory actions, employment terminations, bankruptcy filings, and criminal or civil judicial proceedings.'})
})()
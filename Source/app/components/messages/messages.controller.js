(function() {
    angular.module('listwidget.messages')
        .controller('MessagesController', MessagesController);

    MessagesController.$inject = ['urlfactory', '$sanitize', 'tooltips', '$state'];

    function MessagesController(urlfactory, $sanitize, tooltips, $state) {
        var messageCtl = this;
        messageCtl.firmname;

        var name = $sanitize(urlfactory.getQueryStringVar('firmname'));
        var getPrep = getPrep;
        var activate = activate;
        messageCtl.prep = 'an';
        messageCtl.animeClass = 'fadeInRight';
        messageCtl.hasFirmName = messageCtl.firmname;
        messageCtl.broker = tooltips.broker;
        messageCtl.ia = tooltips.investmentAdviser;
        messageCtl.disclosure = tooltips.disclosure;
        messageCtl.state = $state.current.name;

        activate();

        function activate() {
            if (name) {
                messageCtl.firmname = decodeURIComponent(name);
                var vowels = ['a','e','i','o','u','h'];
                //name is valid
                var firstLetter = (name.substring(0, 1)).toLowerCase();
                if (vowels.indexOf(firstLetter) === -1) {
                    messageCtl.prep = 'a'
                }
            }
            else {
               messageCtl.prep = 'an';
            }


        }


    }
})()
(function() {
    angular.module('listwidget.messages', ['listwidget.core']);
})();(function() {
    angular.module('listwidget.messages')
        .controller('MessagesController', MessagesController);

    MessagesController.$inject = ['urlfactory', '$sanitize'];

    function MessagesController(urlfactory, $sanitize) {
        var messageCtl = this;
        messageCtl.firmname;

        var name = $sanitize(urlfactory.getQueryStringVar('firmname'));
        var getPrep = getPrep;
        var activate = activate;
        messageCtl.prep = 'an';
        messageCtl.animeClass = 'fadeInRight';
        messageCtl.hasFirmName = messageCtl.firmname;

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
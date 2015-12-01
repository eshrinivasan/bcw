(function() {
    angular.module('listwidget.messages', ['listwidget.core']);
})();(function() {
    angular.module('listwidget.messages')
        .controller('MessagesController', MessagesController);

    MessagesController.$inject = ['urlfactory', '$sanitize'];

    function MessagesController(urlfactory, $sanitize) {
        var vm = this;
        vm.firmname = ' ';

        var name = $sanitize(urlfactory.getQueryStringVar('firmname'));
        var getPrep = getPrep;
        var activate = activate;
        vm.prep = 'an';
        vm.animeClass = 'fadeInRight';


        activate();

        function activate() {
            if (name) {
                vm.firmname = decodeURIComponent(name);
                var vowels = ['a','e','i','o','u','h'];
                //name is valid
                var firstLetter = (name.substring(0, 1)).toLowerCase();
                if (vowels.indexOf(firstLetter) === -1) {
                    vm.prep = 'a'
                }
            }
            else {
               vm.prep = 'an';
            }
        }


    }
})()
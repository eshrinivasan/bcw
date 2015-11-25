(function() {
    angular.module('listwidget.messages')
        .controller('MessagesController', MessagesController);

    MessagesController.$inject = ['urlfactory', '$sce'];

    function MessagesController(urlfactory, $sce) {
        var vm = this;
        vm.firmname = decodeURI(urlfactory.getQueryStringVar('firmname'));

    }
})()
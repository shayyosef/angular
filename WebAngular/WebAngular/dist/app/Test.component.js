debugger
angular.module('MyApp').
component('myTest1', {
    template:
    //'<span>{{$ctrl.test}}</span>'
    //
    '<span>{{c.test}}</span>'
    ,
    //controller: function TestController() {
    controller: function () {
        this.test = "TTT-1234!!!";
    }
    , controllerAs: 'c'
});
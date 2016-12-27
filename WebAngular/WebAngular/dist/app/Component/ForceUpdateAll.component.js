app.component('forceUpdateAllComponent', {
        templateUrl: '/dist/app/html/ForceUpdateAll.html'
        , 
        bindings: {
        caption: '<'
        }
        //, controllerAs: 'c'
        ,
        require: {
            parent: '^^wiezmanConfigComponent'
        },
        controller: forceUpdateAllController
        
    });


'use strict';

mainApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl: 'partials/sandbox.html', controller: SandboxPartialCtrl}).
        otherwise({redirectTo: '/'});
}]);
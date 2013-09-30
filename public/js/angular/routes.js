'use strict';

mainApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl: 'partials/view_live.html', controller: ViewLivePartialCtrl}).
        when('/live', {templateUrl: 'partials/view_live.html', controller: ViewLivePartialCtrl}).
        when('/playback', {templateUrl: 'partials/view_playback.html', controller: ViewPlaybackPartialCtrl}).
        otherwise({redirectTo: '/'});
}]);
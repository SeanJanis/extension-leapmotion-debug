'use strict';

//
// AngularJS controller for setting up Javascript
// behind playback data view (recorded / simulated)
// Leap Motion frames.
//
function ViewPlaybackPartialCtrl($scope, $timeout, $http) {
    // Members
    var _canvas;
    var _context;

    $scope.init = function() {
        _canvas = document.getElementById('canvas-sandbox');

        // Ensure proper aspect ratio
        _canvas.width = _canvas.clientWidth;
        _canvas.height = _canvas.clientHeight;


        _context = _canvas.getContext('2d');
        console.log("Switching to playback");
    };

}

ViewPlaybackPartialCtrl.$inject = ['$scope', '$timeout', '$http'];

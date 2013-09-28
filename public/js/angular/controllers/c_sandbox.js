'use strict';

//
// Main sandbox control
//
function SandboxPartialCtrl($scope, $timeout, $http) {
    // Members
    var _canvas;
    var _context;
    var _lm;
    var _lmHandler;

    $scope.init = function() {
        _canvas = document.getElementById('canvas-sandbox');

        // Ensure proper aspect ratio
        _canvas.width = _canvas.clientWidth;
        _canvas.height = _canvas.clientHeight;

        _context = _canvas.getContext('2d');
        _lm = new Leap.Controller();
        _lmHandler = new LeapMotionHandler({
                controller: _lm,
                scope: $scope,
                canvas: _canvas,
                context: _context
        });
        _lmHandler.subscribeListeners();
    };

    //
    // Listeners for when one of the dimension slider fields
    // changes. At this point, we should query the EasyPost
    // API for an update with the data.
    //
    $scope.onSliderChanged = function(target) {
        cancelSliderChangeTimer();
    };

    //
    // Cancels the 2-second EasyPost API timer to prevent
    // excessive hits on their API. Requires at least 2-seconds
    // of inactivity before pulling best rates.
    //
    function cancelSliderChangeTimer(promise) {
        if (promise != null) {
            $timeout.cancel(promise);
        }
    }

    //
    // Proxy: Hits the EasyPost endpoint for finding the best
    // rates related to an address + dimensions combination.
    //
    function queryBestRatesProxy() {
        console.log("QUERYING....");
        return;
    }
}

SandboxPartialCtrl.$inject = ['$scope', '$timeout', '$http'];

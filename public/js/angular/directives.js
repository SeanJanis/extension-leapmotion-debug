'use strict';


//
// Borrowed method to add a directive for going directly
// to a partial's page.
//
mainApp.directive('linkClick', function ($location) {
    return function(scope, element, attrs) {
        var path;

        attrs.$observe('linkClick', function (val) {
            path = val;
        });

        element.bind('click', function () {
            scope.$apply( function () {
                $location.path(path);
            });
        });
    };
});

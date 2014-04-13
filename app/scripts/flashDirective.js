
(function() {
  'use strict';

  angular.module('riverApp')
    .directive('flash', function($timeout) {
      return {
        scope: {
          flash: '=flash'
        },
        template: '<div class="message animate-show" ng-show="show" ng-bind="message"></div>',
        link: function(scope, element, attrs) {

          scope.show = false;

          scope.$watch('flash', function() {
            console.log('msg change');

            scope.show = false;

            $timeout(function() {
              scope.message = scope.flash;
              scope.show = true;
            }, 100);

          });

        }
      };
    });

})();

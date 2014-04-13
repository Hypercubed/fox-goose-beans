
(function() {
  'use strict';

  var app = angular.module('riverApp', ['ngAnimate']);

  app.constant('DEBUG', true);

  app.config(function($logProvider, DEBUG) {
    $logProvider.debugEnabled(DEBUG);
  });

})();

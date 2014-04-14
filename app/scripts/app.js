
(function() {
  'use strict';

  var app = angular.module('riverApp', ['ngAnimate']);

  app.constant('DEBUG', false);

  app.config(function($logProvider, DEBUG) {
    $logProvider.debugEnabled(DEBUG);
  });

})();

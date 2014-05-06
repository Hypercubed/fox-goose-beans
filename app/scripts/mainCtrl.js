
(function() {
  'use strict';

  angular.module('riverApp')
    .service('$game', function rules() {

      var game = {};

      var fox = { name: 'The fox', img: 'http://placehold.it/350x150&text=fox' };
      var goose = { name: 'The goose', img: 'http://placehold.it/350x150&text=goose' };
      var beans = { name: 'A bag of beans', img: 'http://placehold.it/350x150&text=beans' };

      game.items = [fox,goose,beans];  // todo: make private?

      game.rules = [];
      game.rules[0] = { items: [fox,goose],   msg: 'The fox will eat the goose!'};
      game.rules[1] = { items: [goose,beans], msg: 'The goose will eat the bag of beans!' };

      function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array;
      }

      game.getShuffledItems = function() {
        return shuffleArray(game.items.slice(0));
      };

      game.checkRules = function(arr) {

        return game.rules.filter(function(rule) {
          return rule.items.every(function(item) {return arr.indexOf(item) > -1; });
        });

      };

      game.isWin = function(arr) {
        return game.items.every(function(item) {return arr.indexOf(item) > -1; });
      };

      return game;

    });

  angular.module('riverApp')
    .controller('MainCtrl', function ($scope, $interval,$timeout,$log, $game, DEBUG) {

      $scope.debug = DEBUG;

      var isDisabled = false;

      $scope.cloudLeft = '0%';

      $scope.sunStyle = {
        top: '50%',
        left: '20%'
      };

      $scope.moonStyle = {
        top: '50%',
        left: '20%'
      };

      $scope.worldStyle = {
        backgroundColor: '#87CEEB'
      };

      $scope.spaceStyle = {
        '-webkit-transform:rotate': 'rotate(0deg)'
      };

      $scope.time = 6;   // Todo: this can be done better
      //$scope.dayphase = 'day';

      $scope.tick = function incTime() {

        $log.debug($scope.time);

        if ($scope.time === 19) {$scope.message = 'Hurry up, the sun is setting';}
        if ($scope.time === 21) {$scope.message = 'It\'s getting too dark to travel';}

        //$scope.dayphase = ($scope.time > 19) ? 'night' : 'day';

        //$scope.cloudLeft = ($scope.time-6)/(24-6) * 100 +'%';

        var b = ($scope.time-6)/12;
        var a = b*Math.PI;

        $scope.spaceStyle['-webkit-transform'] = 'rotate('+a+'rad)';

        $scope.sunStyle.top = (1 - Math.sin(a) )*20+'%';
        $scope.sunStyle.left = ( b + 1/6)*80+'%';
        //console.log(($scope.time-4)/12*0.80, 0.5+Math.cos(a));

        $scope.moonStyle.top = ( 1 + Math.sin(a-Math.PI/4) )*20+'%';
        $scope.moonStyle.left = ( b - 1/6 - 1)*80+'%';

        $scope.time += 0.5;

        if ($scope.time >= 24) {
          gameOver('Out of time');
        }

      };

      $scope.tick();
      //start();

      function gameOver(msg) {
        endTimer();
        isDisabled = true;
        $scope.message = msg;
      }

      var stop;
      function startTimer() {
        if ( angular.isDefined(stop) ) {return;}

        $scope.tick();
        stop = $interval($scope.tick,2000);
      }

      function endTimer() {
        if (angular.isDefined(stop)) {
          $interval.cancel(stop);
          stop = undefined;
        }
      }

      $scope.message = 'Get all the stuff across the river before sunset.';

      $scope.boatPosition = 0;  // TODO: move to $game?
      $scope.payload = '';

      $scope.field = [];      // TODO: move to game?
      $scope.field[0] = $game.getShuffledItems();
      $scope.field[1] = [];

      function checkMove(f) {

        var violations = $game.checkRules(f);

        if (violations.length > 0) {
          $log.debug('Rule violation');

          var msg = violations.map(function(rule) {
            return rule.msg;
          }).join(' ');

          $scope.message = 'Watch out! '+msg;
          return false;
        }

        return true;
      }

      function checkWin(f, pos) {
        if (pos === 1 && $game.isWin(f)) {
          endTimer();
          gameOver('You win!');
          return true;
        }

        return false;
      }

      $scope.fieldClick =  function unload(position) {

        if (!$scope.payload) {return;}
        if ($scope.field[position].length >= 3) {return;}

        var id = $scope.field[position].length;
        $scope.itemClick(id,position);

      };

      $scope.itemClick = function swapload(id, position) {
        if (isDisabled) {return;}
        if (!stop) {startTimer();}

        if (position !== $scope.boatPosition) {return;}

        var f = $scope.field[position].slice(0);

        var item;
        if ($scope.payload) {
          item = f[id];
          f[id] = $scope.payload;
        } else {
          item = f.splice(id,1)[0];
        }

        if (checkWin(f, position) || checkMove(f)) {
          $scope.field[position] = f;
          $scope.payload = item;
        }
      };

      $scope.row = function() {
        if (isDisabled) {return;}
        if (!stop) {startTimer();}

        $scope.boatPosition = ($scope.boatPosition === 0) ? 1 : 0;
        isDisabled = true;
        $timeout(function() { isDisabled = false; }, 1500);

      };

      $scope.cloudClick = function($event) {
        $scope.time = $event.offsetX/$event.target.offsetWidth*18+5;  // Do this better
        $scope.tick();
      };

    });

})();


(function() {
  'use strict';

  angular.module('riverApp')
    .controller('MainCtrl', function ($scope, $interval,$timeout,$log, DEBUG) {

      $scope.debug = DEBUG;

      var isGameOver = false;

      $scope.cloudLeft = '0%';

      $scope.sunStyle = {
        top: '50%',
        left: '20%'
      }

      $scope.moonStyle = {
        top: '50%',
        left: '20%'
      }

      $scope.worldStyle = {
        backgroundColor: '#87CEEB'
      }

      $scope.spaceStyle = {
        '-webkit-transform:rotate': "rotate(0deg)"
      }

      $scope.time = 6;   // Todo: make 0 - 1or 0 - 12
      $scope.dayphase = 'day';

      $scope.tick = function incTime() {

        $log.debug($scope.time);

        if ($scope.time == 19) $scope.message = 'Hurry up, the sun is setting';
        if ($scope.time == 21) $scope.message = 'It\'s getting too dark to travel';

        $scope.dayphase = ($scope.time > 19) ? 'night' : 'day';

        $scope.cloudLeft = ($scope.time-6)/18 * 100 +'%';

        $scope.spaceStyle['-webkit-transform'] = "rotate("+($scope.time-6)/12*180+"deg)";

        var a = ($scope.time-6)/12*Math.PI;
        $scope.sunStyle.top = 20 - Math.sin(a) * 20+'%';
        $scope.sunStyle.left = ($scope.time-4)/12 * 80+'%';

        $scope.moonStyle.top = 20 - Math.sin(a-Math.PI-Math.PI/4) * 20+'%';
        $scope.moonStyle.left = ($scope.time-4-12-3)/12 * 80+'%';

        $scope.time += 0.5;

        if ($scope.time >= 24) {
          gameOver('Out of time');
        }

      }

      $scope.tick();
      //start();

      function gameOver(msg) {
        end();
        isGameOver = true;
        $scope.message = msg;
        //console.log('stopping');
        //$interval.cancel(stop);
      }

      /* function flash(msg) {
        $scope.message = '';
        $timeout(function() { $scope.message = msg; }, 100);
      } */

      var stop;
      function start() {
        if ( angular.isDefined(stop) ) return;

        $scope.tick();
        stop = $interval($scope.tick,2000);
      }

      function end() {
        if (angular.isDefined(stop)) {
          $interval.cancel(stop);
          stop = undefined;
        }
      }

      $scope.message = 'Get all the stuff across the river before sunset.';

      $scope.boatPosition = 0;
      $scope.payload = "";

      function shuffleArray(array) {
          for (var i = array.length - 1; i > 0; i--) {
              var j = Math.floor(Math.random() * (i + 1));
              var temp = array[i];
              array[i] = array[j];
              array[j] = temp;
          }
          return array;
      }

      var fox = { id: 'The fox', img: 'http://placehold.it/350x150&text=fox' };
      var goose = { id: 'The goose', img: 'http://placehold.it/350x150&text=goose' };
      var beans = { id: 'A bag of beans', img: 'http://placehold.it/350x150&text=beans' };

      $scope.field = [];
      $scope.field[0] = shuffleArray([fox,goose,beans]);
      $scope.field[1] = [];

      var _rules = [
        { msg: "The fox will eat the goose!",
          fn: function(f) {
            return f.indexOf(fox) > -1 && f.indexOf(goose) > -1
          } },
        { msg: "The goose will eat the bag of beans!",
          fn: function(f) {
            return f.indexOf(beans) > -1 && f.indexOf(goose) > -1
          } },
      ]

      function isSafe(f) {

        var violations = _rules.filter(function(rule) {
          return rule.fn(f);
        }).map(function(rule) {
          return rule.msg;
        });

        if (violations.length > 0) {
          $log.debug('Rule violation');
          $scope.message = new String('Watch out! '+violations.join(' '));
          return false;
        }

        return true;
      }

      function isWin(f, pos) {
        if (pos == 1 && f.length == 3) {
          end();
          gameOver('You win!');
          return true;
        }
        return false;
      }

      $scope.fieldClick =  function unload(position) {
        if (isGameOver) return;
        if (!stop) start();

        if (!$scope.payload) return;
        if ($scope.field[position].length >= 3) return;
        if (position != $scope.boatPosition) return;

        var f = $scope.field[position].slice(0);

        f.push($scope.payload);

        if (isWin(f, position) || isSafe(f)) {
          $scope.field[position] = f;
          $scope.payload = null;
        }

      }

      $scope.itemClick = function swapload(id, position) {

        if (isGameOver) return;
        if (!stop) start();

        if (position != $scope.boatPosition) return;

        var f = $scope.field[position].slice(0);

        if ($scope.payload) {
          var item = f[id];
          f[id] = $scope.payload;
        } else {
          var item = f.splice(id,1)[0];
        }

        if (isWin(f, position) || isSafe(f)) {
          $scope.field[position] = f;
          $scope.payload = item;
        }
      }

      $scope.row = function() {
        if (isGameOver) return;
        if (!stop) start();

        $scope.boatPosition = !$scope.boatPosition;
        isGameOver = true;
        $timeout(function() { isGameOver = false; }, 2000);

      }

    });

})();

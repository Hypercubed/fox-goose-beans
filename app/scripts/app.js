'use strict';

angular.module('riverApp', ['ngAnimate']);

angular.module('riverApp')
  .controller('MainCtrl', function ($scope, $interval,$timeout) {

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

    $scope.time = 6;
    $scope.dayphase = 'day';

    $scope.tick = function incTime() {

      console.log($scope.time);

      if ($scope.time >= 23) {
        end();
        return gameOver('Out of time');
      }

      $scope.dayphase =($scope.time > 19) ? 'night' : 'day';

      $scope.cloudLeft = ($scope.time-4)/12 * 50+'%';

      $scope.spaceStyle['-webkit-transform'] = "rotate("+($scope.time-6)/12*180+"deg)";

      var a = ($scope.time-6)/12*Math.PI;
      $scope.sunStyle.top = 20 - Math.sin(a) * 20+'%';
      $scope.sunStyle.left = ($scope.time-4)/12 * 80+'%';

      $scope.moonStyle.top = 20 - Math.sin(a-Math.PI-Math.PI/4) * 20+'%';
      $scope.moonStyle.left = ($scope.time-4-12-3)/12 * 80+'%';

      $scope.time += 0.5;

    }

    $scope.tick();
    //start();

    function gameOver(msg) {
      isGameOver = true;
      flash(msg);
      //console.log('stopping');
      //$interval.cancel(stop);
    }

    function flash(msg) {
      $scope.message = '';
      $timeout(function() { $scope.message = msg; }, 100);
    }

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

    flash('Get all the stuff across the river before sunset.');

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

    $scope.field = [];
    $scope.field[0] = shuffleArray(["The fox","The goose","A bag of beans"]);
    $scope.field[1] = ["","",""];

    var rules = [
      ["The fox","The goose","The fox will eat the goose!"],
      ["The goose","A bag of beans","The goose will eat the bag of beans!"]
    ]

    function isSafe(f) {

      for (var i = 0; i < rules.length; i++) {
        if (f.indexOf(rules[i][0]) > -1 && f.indexOf(rules[i][1]) > -1) {
          flash('Watch out! '+rules[i][2]);
          //$scope.message = 'Watch out! '+rules[i][2];
          return false;
        }
      }
      return true;
    }

    function isWin(f, pos) {
      if (pos == 1 && f.indexOf('') < 0) {
        end();
        gameOver('You win!');
        return true;
      }
      return false;
    }

    function swapload(id, position) {
      if (isGameOver) return;
      start();
      var f = $scope.field[position].slice(0);

      var tmp = f[id];
      f[id] = $scope.payload;

      if (isWin(f, position) || isSafe(f)) {
        $scope.field[position][id] = $scope.payload;
        $scope.payload = tmp;
      }
    }

    $scope.row = function() {
      if (isGameOver) return;
      start();
      $scope.boatPosition = !$scope.boatPosition;
    }

    $scope.itemClick = function(id, position) {
      if (position != $scope.boatPosition) {
        //$scope.row();
        return;
      }

      swapload(id, position);

    }

  });

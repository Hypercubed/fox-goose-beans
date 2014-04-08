'use strict';

angular.module('riverApp', []);

angular.module('riverApp')
  .controller('MainCtrl', function ($scope, $interval) {

    var isGameOver = false;

    $scope.cloudLeft = '0%';

    $scope.sunStyle = {
      top: '50%',
      left: '20%'
    }

    $scope.worldStyle = {
      backgroundColor: '#87CEEB'
    }

    $scope.time = 2;

    incTime();

    function gameOver(msg) {
      isGameOver = true;
      $scope.message = msg;
      $interval.cancel(stop);
    }

    function incTime() {
      console.log($scope.time);

      if ($scope.time >= 22) {
        return gameOver('Out of time');
      }

      $scope.time %= 24;

      var a = $scope.time / 12 * Math.PI;

      if ($scope.time >= 11) {
        $scope.worldStyle.backgroundColor = '#000';
        $scope.worldStyle.color = '#fff';
      }

      if ($scope.time < 14) {
        $scope.sunStyle.top = 50 - Math.sin(a) * 50+'%';
        $scope.sunStyle.left = $scope.time/12 * 100+'%';
      }

      $scope.cloudLeft = $scope.time/12 * 50+'%';

      $scope.time += 0.5;

    }

    var stop = null;

    function start() {
      incTime();
      if (!stop) {
        stop = $interval(incTime,2000);
      }
    }

    $scope.message = 'Get all the stuff across the river';

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
          $scope.message = 'Watch out! '+rules[i][2];
          return false;
        }
      }
      return true;
    }

    function isWin(f, pos) {
      if (pos == 1 && f.indexOf('') < 0) {
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
        $scope.row();
        return;
      }

      swapload(id, position);

    }

  });

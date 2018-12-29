/* jslint node: true */
'use strict';

var app = angular.module('steam-with-friends', []);

app.controller('steamCtrl', function ($scope, $interval, $http) {
	$scope.user1_url = 'https://steamcommunity.com/id/rattmuffen/';
	$scope.user2_url = 'https://steamcommunity.com/id/nilshenrik/';

	$scope.user1_profile = '';
	$scope.user2_profile = '';

	$scope.result = [];
	$scope.errorCode = '';
	$scope.errorDetails = '';
	$scope.loading = false;

	$scope.randomGame = '';

	$scope.getGames = function (url1, url2) {
		$scope.result = [];
		$scope.loading = true;
		
		var queryObj = {
			"url1": url1,
			"url2": url2
		}

		var query = 'steam/getGames/' + encodeURIComponent(JSON.stringify(queryObj));
		$http.get(query)
			.then(function(resp) {
				console.log(resp);
				if (resp.status == 200 && resp.data) {
					$scope.user1_profile = resp.data.user1.profile;
					$scope.user2_profile = resp.data.user2.profile;

					getSharedGames(resp.data.user1.games, resp.data.user2.games);
				} else {
					$scope.errorCode = resp.status;
					$scope.errorDetails = resp.data;
					$scope.loading = false;
				}
			});
	}

	$scope.selectRandomGame = function() {
		var rndIndex = Math.floor(Math.random() * $scope.result.length);
		$scope.randomGame = $scope.result[rndIndex];

		$('#randomGameModal').modal('toggle')
	}

	function getSharedGames(gameList1, gameList2) {
		var sharedGames = [];
		for (var i = 0; i < gameList1.length; i++) {
			var game = gameList1[i];
			if (hasGame(game, gameList2)) {
				sharedGames.push(game);
			}
		}

		$scope.result = sharedGames;
		$scope.loading = false;
	}

	function hasGame(game, gameList) {
		for (var i = 0; i < gameList.length; i++) {
			var g = gameList[i];
			if (game.appID == g.appID) {
					return true;
			}
		}
		return false;
	}
});

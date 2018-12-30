/* jslint node: true */
'use strict';

$(document).ready(function () {
	// Bootstrap custom form validation.
	var forms = document.getElementsByClassName('form-validate');
	var validation = Array.prototype.filter.call(forms, function(form) {
		form.addEventListener('submit', function(event) {
			if (form.checkValidity() === false) {
				event.preventDefault();
				event.stopPropagation();
			}
			form.classList.add('was-validated');
		}, false);
	});
});

var app = angular.module('steam-with-friends', []);

app.controller('steamCtrl', function ($scope, $interval, $http) {
	$scope.STEAM_BASE_URL = 'https://steamcommunity.com/id/'
	$scope.user1_profile = 'rattmuffen';
	$scope.user2_profile = 'nilshenrik';

	$scope.user1;
	$scope.user2;

	$scope.result = [];
	$scope.errorCode = '';
	$scope.errorDetails = '';
	$scope.loading = false;

	$scope.randomGame = '';

	$scope.getGames = function () {
		console.log('GetGames for ' + $scope.user1_profile + ' and ' + $scope.user2_profile)

		$scope.result = [];
		$scope.loading = true;

		var queryObj = {
			"url1": $scope.STEAM_BASE_URL + $scope.user1_profile,
			"url2": $scope.STEAM_BASE_URL + $scope.user2_profile
		}

		var query = 'steam/getGames/' + encodeURIComponent(JSON.stringify(queryObj));
		$http.get(query)
			.then(function(resp) {
				console.log(resp);
				if (resp.status == 200 && resp.data.user1 && resp.data.user2) {
					$scope.user1 = resp.data.user1;
					$scope.user2 = resp.data.user2;

					getSharedGames(resp.data.user1.games, resp.data.user2.games);
				} else {
					$scope.errorCode = (resp.status != 200 ? resp.status : resp.data.code);
					$scope.errorDetails = (resp.status != 200 ? resp.data : resp.data.data);
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

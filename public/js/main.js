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

	$scope.filter = {
		unplayed: false
	};

	$scope.sortTypes = [
		{name : 'alphabetically', field: 'name'},
		{name : 'by $user1 play time', field: 'user1PlayTime'},
		{name : 'by $user2 play time', field: 'user2PlayTime'}
	];

	$scope.sortField = 'name';
	$scope.reverse = false;

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

					getSharedGames($scope.user1.games, $scope.user2.games);
				} else {
					$scope.errorCode = (resp.status != 200 ? resp.status : resp.data.code);
					$scope.errorDetails = (resp.status != 200 ? resp.data : resp.data.data);
					$scope.loading = false;
				}
			});
	}

	$scope.selectRandomGame = function() {
		var filteredGames = $scope.getFilteredGames();
		var rndIndex = Math.floor(Math.random() * filteredGames.length);
		$scope.randomGame = filteredGames[rndIndex];

		$('#randomGameModal').modal('toggle');
	}

	$scope.inFilter = function(game) {
		if ($scope.filter.unplayed) {
			return (game.user1PlayTime == 0 && game.user2PlayTime == 0);
		}
		return true;
	}

	$scope.getFilteredGames = function() {
		var res = [];
		for (var i = 0; i < $scope.result.length; i++) {
			var game = $scope.result[i];
			if ($scope.inFilter(game)) {
				res.push(game);
			}
		}
		return res;
	}

	$scope.getSortName = function(sort) {
		return sort.name.replace('$user1', $scope.user1.profile.nickname).replace('$user2', $scope.user2.profile.nickname);
	}

	$scope.updateSortOrder = function() {
		$scope.sortField = $('#sortSelect').val();
		$scope.reverse = $('#orderSelect').val() == 'true';
	}

	function getSharedGames(gameList1, gameList2) {
		var sharedGames = [];
		for (var i = 0; i < gameList1.length; i++) {
			var user1Game = gameList1[i];
			var user2Game = hasGame(user1Game, gameList2)
			if (user2Game) {
				user1Game.user1PlayTime = user1Game.playTime;
				user1Game.user2PlayTime = user2Game.playTime;

				sharedGames.push(user1Game);
			}
		}

		$scope.result = sharedGames;
		$scope.loading = false;
	}

	function hasGame(game, gameList) {
		for (var i = 0; i < gameList.length; i++) {
			var g = gameList[i];
			if (game.appID == g.appID) {
					return g;
			}
		}
		return null;
	}
});

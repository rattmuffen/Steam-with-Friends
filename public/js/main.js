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

	$scope.sharedGames = [];
	$scope.errorCode = '';
	$scope.errorDetails = '';
	$scope.loading = false;

	$scope.randomGame = '';

	$scope.filter = {
		unplayed: false,
		multiplayer: false
	};

	$scope.sortTypes = [
		{name : 'alphabetically', field: 'name'},
		{name : 'by $user1 play time', field: 'user1PlayTime'},
		{name : 'by $user2 play time', field: 'user2PlayTime'}
	];

	$scope.sortField = 'name';
	$scope.reverse = false;

	$scope.multiplayerCategories = [
		{id: 9, description: "Co-op"},
		{id: 1, description: "Multi-player"},
		{id: 27, description: "Cross-Platform Multiplayer"},
		{id: 38, description: "Online Co-op"}
	]

	$scope.getGames = function () {
		console.log('GetGames for ' + $scope.user1_profile + ' and ' + $scope.user2_profile)

		$scope.sharedGames = [];
		$scope.loading = true;

		var queryObj = {
			"url1": $scope.STEAM_BASE_URL + $scope.user1_profile,
			"url2": $scope.STEAM_BASE_URL + $scope.user2_profile
		}

		var query = 'steam/getGames/' + encodeURIComponent(JSON.stringify(queryObj));
		$http.get(query)
			.then(function(resp) {
				console.log(resp);
				if (resp.status == 200 && resp.data.user1 && resp.data.user2 && resp.data.sharedGames) {
					$scope.user1 = resp.data.user1;
					$scope.user2 = resp.data.user2;
					$scope.sharedGames = resp.data.sharedGames;

					$scope.loading = false;
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
		var inFilter = true;
		if ($scope.filter.unplayed) {
			inFilter = (game.user1PlayTime == 0 && game.user2PlayTime == 0);
		}

		if (inFilter && $scope.filter.multiplayer) {
			inFilter = hasCategories(game, $scope.multiplayerCategories)
		}
		return inFilter;
	}

	$scope.getFilteredGames = function() {
		var res = [];
		for (var i = 0; i < $scope.sharedGames.length; i++) {
			var game = $scope.sharedGames[i];
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

	function hasCategories(game, categories) {
		if (!game.details || !game.details.categories) {
			return false;
		}

		for (var i = 0; i < game.details.categories.length; i++) {
			var category = game.details.categories[i];
			for (var j = 0; j < $scope.multiplayerCategories.length; j++) {
				if ($scope.multiplayerCategories[j].id == category.id) {
					return true;
				}
			}
		}
		return false;
	}
});

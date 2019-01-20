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

var app = angular.module('steam-with-friends', ['selectize']);

app.controller('steamCtrl', function ($scope, $window, $http) {
	$scope.SETTING_KEY = 'steam-setting';
	$scope.STEAM_BASE_URL = 'https://steamcommunity.com/id/';
	$scope.user1_profile = '';
	$scope.user2_profile = '';

	$scope.user1;
	$scope.user2;

	$scope.sharedGames = [];
	$scope.allCategories = [];
	$scope.errorCode = '';
	$scope.errorDetails = '';
	$scope.loading = false;

	$scope.randomGame = '';

	$scope.filter = {
		unplayed: false,
		multiplayer: false,
		categoriesAnd: false,
		categories: []
	};

	$scope.sortTypes = [
		{name : 'alphabetically', field: 'name'},
		{name : 'by $user1 play time', field: 'user1PlayTime'},
		{name : 'by $user2 play time', field: 'user2PlayTime'},
		{name : 'by number of recommendations', field: 'details.redommendations.total'},
		{name : 'by release date', field: 'details.release_date.dateEpoch'},
		{name : 'by Metacritic rating', field: 'details.metacritic.score'},
	];

	$scope.sortField = 'name';
	$scope.reverse = false;

	$scope.multiplayerCategories = [ '9', '1' , '27', '38' ];
	$scope.controllerCategories = [ '18', '28' ];
	$scope.selectizeConfig = {
		plugins: ['remove_button'],
		create: false,
		sortField: {field: 'description'},
		valueField: 'id',
		searchField: 'description',
		selectOnTab: true,
		placeholder: "Select categories",
		dataAttr: 'description',
		labelField: 'description',
		maxItems: null,
		closeAfterSelect: true
	}

	$scope.getGames = function () {
		if ($scope.user1_profile.trim() == '' ||  $scope.user2_profile.trim() == '') {
			return;
		}

		console.log('GetGames for ' + $scope.user1_profile + ' and ' + $scope.user2_profile);

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
					$scope.allCategories = resp.data.categories;

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

		if (inFilter) {
			inFilter = hasCategories(game, $scope.filter.categories)
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

		$scope.saveSettings();
	}

	$scope.saveSettings = function() {
		var obj = {
			user1_profile: $scope.user1_profile,
			user2_profile: $scope.user2_profile,
			filter: $scope.filter,
			sortField : $scope.sortField,
			reverse : $scope.reverse
		}

		$window.localStorage.setItem($scope.SETTING_KEY, JSON.stringify(obj));
	}

	$scope.readSettings = function() {
		var obj = JSON.parse($window.localStorage.getItem($scope.SETTING_KEY));
		if (obj) {
			$scope.user1_profile = obj.user1_profile;
			$scope.user2_profile = obj.user2_profile;
			$scope.filter = obj.filter;
			$scope.sortField = obj.sortField;
			$scope.reverse = obj.reverse;
		}
	}

	function hasCategories(game, categories) {
		if (!categories || categories.length == 0) {
			return true;
		}

		if (!game.details || !game.details.categories) {
			return false;
		}

		if ($scope.filter.categoriesAnd) {
			for (var i = 0; i < categories.length; i++) {
				var category = categories[i];
				if (!game.details.categories.some( cat => cat['id'] + '' === category)) {
					return false;
				}
			}
			return true;
		} else {
			for (var i = 0; i < categories.length; i++) {
				var category = categories[i];
				if (game.details.categories.some( cat => cat['id'] + '' === category)) {
					return true;
				}
			}
			return false;
		}
	}
});

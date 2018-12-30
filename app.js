/* jslint node: true */
'use strict';

const express = require('express')
const SteamAPI = require('steamapi');
const steam_api_key = process.env.STEAM_API_KEY || require('./conf/steam.json').api_key;
const app = express()
app.use(express.static(__dirname + '/public'));
var port = process.env.PORT || 7845;
var router = express.Router();

var steam;

router.get('/getGames/:query', function (req, res) {
	console.log('GetGames request: ' + req.params.query)
	var query = JSON.parse(req.params.query);

	getId(query.url1, function (id1) {
		getUserGames(id1, function (user1) {
			var users = {
				'user1': user1,
				'user2': ''
			}

			getId(query.url2, function (id2) {
				getUserGames(id2, function (user2) {
					users.user2 = user2;
					res.send(JSON.stringify(users));
				}, function (error) {
					sendError(res, 500, error);
				})
			}, function (error) {
				sendError(res, 500, error);
			})
		}, function (error) {
			sendError(res, 500, error);
		})
	}, function (error) {
		sendError(res, 500, error);
	})
});

function sendError(res, code, error) {
	var errObj = {
		'code': code,
		'data': error
	}
	res.send(JSON.stringify(errObj));
}

function initAPI() {
	if (!steam) {
		console.log('Init API with key: ' + steam_api_key);
		steam = new SteamAPI(steam_api_key)
	}
}

function getId(url, success, fail) {
	initAPI();
	steam.resolve(url).then(id => {
		success(id);
	}).catch(err => {
		console.log(err);
		fail('Error getting user ID for profile ' + url + ': ' + err);
	});
}

function getUserGames(id, success, fail) {
	initAPI();

	steam.getUserSummary(id).then(summary => {
		var user = {
			'profile': summary,
			'games': ''
		}
		steam.getUserOwnedGames(id).then(games => {
			user.games = games;
			success(user)
		}).catch(err => {
			console.log(err);
			fail('Could not get games for user ' + id + ': ' + err);
		});
	}).catch(err => {
		console.log(err);
		fail('Could not get user summary for user ' + id + ': ' + err);
	});
}

app.use('/steam', router);
var server = app.listen(port, function () {
		console.log('Listening on port %d', server.address().port);
});

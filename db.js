var MongoClient = require('mongodb').MongoClient;
var COLLECTION = 'gamedetails';

var HOST = process.env.MONGODB_HOST || require('./conf/db.json').host;
var PORT = process.env.MONGODB_PORT || require('./conf/db.json').port;
var USERNAME = process.env.MONGODB_USERNAME || require('./conf/db.json').username;
var PASSWORD = process.env.MONGODB_PASSWORD || require('./conf/db.json').password;
var NAME = process.env.MONGODB_NAME || require('./conf/db.json').dbname;

exports.add = function(id, data, success, fail) {
  initDB(function (db, collection) {
    var object = {
      _id: id,
      details: data
    };

    collection.insertOne(object, function(err, res) {
      if (err) {
        db.close();
        fail('Could not add details to DB: ' + err)
      };
      console.log('Adding record to DB for AppID: ' + id);
      db.close();
      success();
    });
  }, function (err) {
    fail(err);
  });
}

exports.get = function(id, success, fail) {
  initDB(function (db, collection) {
    collection.find({_id: id}).limit(1).toArray(function(err, result) {
      if (err) {
        db.close();
        fail('Could not get details from DB: ' + err);
      }

      db.close();
      success(result);
    });
  }, function (err) {
    fail(err);
  });
}

function constructConnectionURL() {
  if (!USERNAME || !PASSWORD || USERNAME == '' || PASSWORD == '') {
    return 'mongodb://' + HOST + ':' + PORT + '/' + NAME;
  } else {
    return 'mongodb://' + USERNAME + ':' + PASSWORD + '@' + HOST + ':' + PORT + '/' + NAME;
  }
}

function initDB(success, fail) {
  var url = constructConnectionURL();
  var client = MongoClient(url);
  client.connect(function(err) {
    if (err) {
      fail('Error connecting to DB: ' + err);
    }

    var db = client.db();
    db.createCollection(COLLECTION, function(err, res) {
      if (err) {
        fail('Error creating collection in DB: ' + err);;
      }
      var collection = db.collection(COLLECTION);
      success(client, collection);
    });
  });
}

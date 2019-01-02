# Steam with Friends

Steam with Friends is a small nodejs webapp for helping out stuggling players to select which game to play together!


## Dependencies

Backend:
* [express](https://expressjs.com/)
* [node-steamapi](https://github.com/xDimGG/node-steamapi)
* [node-mongodb](https://github.com/mongodb/node-mongodb-native)
* [async](http://caolan.github.io/async/)
* [moment.js](https://momentjs.com/)

Frontend:
* [angularjs](https://angularjs.org/) (Yes, the old one!)
* [jQuery](https://jquery.com/)
* [popper.js](https://popper.js.org)
* [bootstrap](https://getbootstrap.com/)
* [FontAwesome](https://fontawesome.com/)

## Requirements

### Database

The Steam game details are stored in a [MongoDB](https://www.mongodb.com/) database in order to not overuse the API.

The database connection details needs to be placed in `conf\db.json`, example:

    {
      "host": "localhost",
      "port": "27017",
      "user": "turtlemania",
      "password": "iliketurtles123",
      "name": "steam"
    }

### API keys

A Steam API key is needed to communicate with the Steam API (read more here: https://steamcommunity.com/dev).

The key needs to be placed in `conf\steam.json`, example:

    {
      "api_key": "IMNOTGONNAPUTMYAPIKEYINTHEREADMEDUDE"
    }

## How to install and run

Install MongoDB (instructions [here](https://docs.mongodb.com/manual/administration/install-community/)) and start an instance. Set the connection details in `conf\db.json`.

Install backend dependencies with `npm install`, then just start with `node app.js` like usual!

## Deployments
The `master`-branch is currently deployed here: https://steam-with-friends.herokuapp.com

Note that auto-deployment is turned on, so don't commit anything catastrophically bad plz!

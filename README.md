# Steam with Friends

Steam with Friends is a small nodejs webapp for helping out stuggling players to select which game to play together!


## Dependencies

Backend:
* [express](https://expressjs.com/)
* [node-steamapi](https://github.com/xDimGG/node-steamapi)

Frontend:
* [angularjs](https://angularjs.org/) (Yes, the old one!)
* [jQuery](https://jquery.com/)
* [popper.js](https://popper.js.org)
* [bootstrap](https://getbootstrap.com/)
* [FontAwesome](https://fontawesome.com/)

## Requirements

A Steam API key is needed to communicate with the Steam API (read more here: https://steamcommunity.com/dev).

The key needs to be placed in `conf\steam.json`, example:

    {
      "api_key": "IMNOTGONNAPUTMYAPIKEYINTHEREADMEDUDE"
    }

## How to install and run

Install backend dependencies with `npm install`, then just start with `node app.js` like usual!

## Deployments
The `master`-branch is currently deployed here: https://steam-with-friends.herokuapp.com

Note that auto-deployment is turned on, so don't commit anything catastrophically bad plz!

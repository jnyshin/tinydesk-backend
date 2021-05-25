# The Back-end Repository for Command T

Our front-end repository is at here [project-416](https://github.com/janarosmonaliev/project-416).

### Also, our main file is "server.js", not "App.js".

This back-end repository is deployed through Heroku [click here](https://commandt-backend.herokuapp.com/).
Note that only <I>Back End</I> is deployed. Our front-end repository will be deployed through Heroku. 

### How we push changes to Heroku Application.
This repository is deployed on Heroku. Thus, whenever we make pull request on master branch it will be updated and deployed automatically.

### Note on useful commands for the team members when using Heroku CLI:

1. To take the heroku app offline, remove the dyno with the command:
heroku ps:scale web=0

2. To restart the dyno:
heroku dyno:restart

2. To take the heroku app online once again:
heroku ps:scale web=1

4. To build based on the code pushed to master branch:
git push heroku master

### Development & Production Configuration
#### Set node environment
1. Go to `.env` file. <br />
2. If you are developing on Localhost, change `NODE_ENV` to `development` <br />
3. Before you push to master, change `NODE_ENV` to `production`


#### Start server in development
command: `npm run dev`
 <br />
 <br />
Last updated on 5/25/2021

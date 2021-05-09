# The Back-end Repository for Command T

Our front-end repository is at here [project-416](https://github.com/janarosmonaliev/project-416).

### Also, our main file is "server.js", not "App.js".

This back-end repository is deployed through Heroku [click here](https://commadt.herokuapp.com/).
Note that only <I>Back End</I> is deployed. Our front-end repository will be deployed through Heroku. 

### How we push changes to Heroku Application.
1. Pull request all commits to <B>master</B> branch
2. Since the Heroku Application was deployed using Yejin Shin's account, only Yejin can push the change to our Heroku Application. Yejin will run ```heroku git push master```.
3. The changes are now applied to the Heroku App. 

### Do you want to test your code before applying it to Heroky Application?
1. check <B>server.js</B>
```
app.listen(process.ENV.PORT || 4000, () => {
  console.log("Server started successfully");
});
```
2. Delete ```process.ENV.PORT``` (port address that Heroku uses)and make this app listen to only local host 4000.
3. Run your code with ```node server.js```

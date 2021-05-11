# The Back-end Repository for Command T

Our front-end repository is at here [project-416](https://github.com/janarosmonaliev/project-416).

### Also, our main file is "server.js", not "App.js".

This back-end repository is deployed through Heroku [click here](https://commandt-backend.herokuapp.com/).
Note that only <I>Back End</I> is deployed. Our front-end repository will be deployed through Heroku. 

### How we push changes to Heroku Application.
This repository is deployed on Heroku. Thus, whenever we make pull request on master branch it will be updated and deployed automatically.

### Do you want to test your code before applying it to Heroky Application?
1. check <B>server.js</B>
```
app.listen(process.ENV.PORT || 4000, () => {
  console.log("Server started successfully");
});
```
2. Delete ```process.ENV.PORT``` (port address that Heroku uses)and make this app listen to only local host 4000.
3. Run your code with ```node server.js```


Last updated on 5/11/2021

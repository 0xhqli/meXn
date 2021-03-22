A script to quickly create a base api server with model templates using MongoDB, Express, and Mongoose.
To use, drop the script into the directory you would like the server to be made in, then from terminal/cmd
navigate to the directory and type in
```
node meXn.js
```
It'll ask for the name of your DB in MongoDB
and then ask for the names of the models you would like to make delimited by spaces
Then it'll make a new folder called 'server', generate the files for the server
and install express, mongoose, and cors for you at the end.

Then, navigate into each model and fill out the fields you want the model to have.

To run the server, just cd into the server folder, and type in
```
node server.js
```

if you would like to add more models later, run the mkModels.js file in the server folder using
```
node mkModels.js
```
It'll ask you for the names of the models you would like to generate delimited by spaces again
and make new files for the new models and update the server.js with the new routes for you.

Not fully tested yet/work in progress

Not sure if all restrictions on file/folder names are checked yet

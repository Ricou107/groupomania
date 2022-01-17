# groupomania

# Requirements
You need to have NodeJS and MySQL insstalled on your computer. A MySQL Server must be running. The default port of MySQL is 3306. You can change the port in the .env file if nedded.

The backend will run on port 3001 and the frontend on port 3000.
If you need to change the port of the backend, you'll need to update the REACT_APP_API_URL variable in the .env file of the frontend.

# How to start
## Frontend
Go to groupomania-front folder with a Terminal.
Type `npm install` to install node modules then type `npm start` to launch the app

## Backend
Go to groupomania-back folder with a Terminal.
Type `npm install` to install node modules then type `npm start` to launch the backend server. The database will automatically be created if it doesn't exist.

# Dotenv
The dotenv files are provided. You may need to modify MySQL parameters (user and password).

# Moderation
By default, the first user to register (the one that will have the id #1 in the database) will be moderator and have rights to delete all posts from everyone.

# Enjoy !

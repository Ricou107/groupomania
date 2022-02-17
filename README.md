# groupomania

This app is a social media app made for a fictional company call groupomania. On this app, you'll be able to create an account, make posts with text and/or picture. You'll be able to like posts, comment on posts and modify your profile picute, your personal informations and so on. You can consult profiles of other accounts.

This app is made with ReactsJS, Material UI and Redux for the frontend.

For the backend, I used Express with MySQL. For security, I used bcrypt and Jsonwebtoken and Multer to upload pictures.

# Requirements
You need to have NodeJS and MySQL installed on your computer. A MySQL Server must be running. The default port of MySQL is 3306. You can change the port in the .env file if nedded.

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

## Final look of the project
![Capture d’écran 2022-02-17 à 12 43 44](https://user-images.githubusercontent.com/76947043/154474742-12fc1659-0bdc-4003-8562-a83f7ced10a1.png)


# Enjoy !

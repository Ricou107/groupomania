const mysql = require('mysql2');

/*
const db = mysql.createConnection({
host: "localhost",
user: "root",
password: ""
})



initialize();

async function initialize() {
    const connection = await mysqlpromise.createConnection({ host: "localhost",
    user: "root",
    password: ""});
    await connection.query(`CREATE DATABASE IF NOT EXISTS test;`);

    const db2 =  await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database:"test" 
        })

    db2.query("CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER NOT NULL auto_increment PRIMARY KEY , `email` VARCHAR(255) NOT NULL UNIQUE, `handle` VARCHAR(255) NOT NULL UNIQUE, `name` VARCHAR(255) NOT NULL, `password` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL DEFAULT current_timestamp, `updatedAt` DATETIME NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp)")

    db2.query("CREATE TABLE IF NOT EXISTS `profiles` (`id` INTEGER NOT NULL auto_increment PRIMARY KEY , `userId` INTEGER NOT NULL, `location` VARCHAR(255) NOT NULL, `bio` VARCHAR(255) NOT NULL, `profileImageUrl` VARCHAR(255) NOT NULL, `backgroundImageUrl`  VARCHAR(255) NOT NULL)")

    db2.query("CREATE TABLE IF NOT EXISTS `likes` (`id` INTEGER NOT NULL auto_increment PRIMARY KEY , `userId` INTEGER NOT NULL, `authorId` INTEGER NOT NULL)")

    db2.query("CREATE TABLE IF NOT EXISTS `comments` (`id` INTEGER NOT NULL auto_increment PRIMARY KEY , `userId` INTEGER NOT NULL, `authorId` INTEGER NOT NULL, `text` VARCHAR(255) NOT NULL)")
        

}  */

var con = mysql.createConnection({
    host: `${process.env.HOST}`,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`
  });
   
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, function (err, result) {
      if (err) throw err;
      console.log(`Database initialized !`)
      con.query(`USE ${process.env.DB_NAME}`)
      con.query("CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER NOT NULL auto_increment PRIMARY KEY , `email` VARCHAR(255) NOT NULL UNIQUE, `handle` VARCHAR(255) NOT NULL UNIQUE, `name` VARCHAR(255) NOT NULL, `password` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL DEFAULT current_timestamp, `updatedAt` DATETIME NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp)")

      con.query("CREATE TABLE IF NOT EXISTS `posts` (`id` INTEGER NOT NULL auto_increment PRIMARY KEY , `text` VARCHAR(255), `authorId` INTEGER NOT NULL, `likes` INTEGER NOT NULL, `image` VARCHAR(255), `comments` INTEGER NOT NULL, `isLIKED` BOOLEAN NOT NULL, `createdAt` DATETIME NOT NULL DEFAULT current_timestamp, `updatedAt` DATETIME NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp)")

      con.query("CREATE TABLE IF NOT EXISTS `profiles` (`id` INTEGER NOT NULL auto_increment PRIMARY KEY , `userId` INTEGER NOT NULL, `location` VARCHAR(255) NOT NULL, `bio` VARCHAR(255) NOT NULL, `profileImageUrl` VARCHAR(255) NOT NULL, `backgroundImageUrl`  VARCHAR(255) NOT NULL)")
  
      con.query("CREATE TABLE IF NOT EXISTS `likes` (`id` INTEGER NOT NULL auto_increment PRIMARY KEY , `postId` INTEGER NOT NULL, `authorId` INTEGER NOT NULL)")
  
      con.query("CREATE TABLE IF NOT EXISTS `comments` (`id` INTEGER NOT NULL auto_increment PRIMARY KEY , `postId` INTEGER NOT NULL, `authorId` INTEGER NOT NULL, `comment` VARCHAR(255) NOT NULL, commentCreatedAt DATETIME NOT NULL DEFAULT current_timestamp)");
      con = mysql.createConnection({
        host: `${process.env.HOST}`,
        user: `${process.env.DB_USER}`,
        password: `${process.env.DB_PASSWORD}`,
        database : `${process.env.DB_NAME}`
      });
    });
  }); 
 

module.exports = con; 
 
 
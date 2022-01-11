const express = require("express");
const bcrypt = require("bcrypt");
//const User = require("../models/user.model");
const generateAuthToken = require("../utils/generateAuthToken");
const router = express.Router();
//const Profile = require("../models/profile.model");
//const Follower = require("../models/follower.model");
//const Following = require("../models/following.model");
const verifyAuthentication = require("../middlewares/auth.middleware");
const db = require('../config/db');


router.post("/register", async (req, res) => {

  db.query("SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)", req.body.email, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ err });;
    } else {
      if (Object.values(result[0])[0] == 1) {
        res.status(401).json({ message: "Utilisateur existe deja !" });;
      } else {
        bcrypt.hash(req.body.password, 10)
          .then(hash => {
            //const user = new User({
            const email = req.body.email;
            const handle = req.body.handle;
            const name = req.body.name;
            const password = hash;
            //});

            db.query("INSERT INTO users (email, Password, handle, name) VALUES (?,?,?,?)", [email, password, handle, name], (err, result) => {
              if (err) {
                console.log(err);
                res.status(400).json({ err })
              } else {
                console.log(result);
                const token = generateAuthToken(result.insertId);
                db.query("INSERT INTO profiles (userId, location, bio, profileImageUrl, backgroundImageUrl) VALUES (?,?,?,?,?)", [result.insertId, "Mon univers", "Ma bio !", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png", "https://images.pexels.com/photos/9347250/pexels-photo-9347250.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]);
                res.status(201).json({ message: 'Utilisateur créé !',
                response: {
                  name: name,
                  email: email,
                  id: result.insertId,
                  token,
                }
               })
              }
            });
          })
          .catch(error => res.status(500).json({ error }));
      }
    }
  });
});

router.get("/users", verifyAuthentication, async (req, res) => {
  try {
    db.query("SELECT * FROM users WHERE email = ?", req.body.email, (err,result)=>{
    res.status(200).json({
      response: {
        result,
      },
      message: "Users fetched successfully.",
    });
  })
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
 

  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM users WHERE email = ?", email, (err,result)=>{
    if(err) {
        console.log(err);
        return res.status(500).json({ err });;
    } else {
        if (result.length !== 1) {
            return res.status(401).json({ message : "Utilisateur non trouve !"});;
            
        } else {
            console.log(req.body.password, result[0].password)
            bcrypt.compare(req.body.password, result[0].password)
            .then(valid => {
                if (!valid) {
                  return res.status(401).json({ error: 'Mot de passe incorrect !' });
                } else {

                    const token = generateAuthToken(result[0].id);

                    return res.status(200).json({
                      message: "Logged in successfully.",
                      response: {
                      token,
                      name: result[0].name,
                      email: result[0].email,
                      handle : result[0].handle,
                      id: result[0].id,
                    },
                  }); 
                }
            })
            .catch(error => res.status(500).json({ error }));
        }
    }
});

});

module.exports = router;

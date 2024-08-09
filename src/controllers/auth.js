"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */

const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const User = require("../models/user");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const { CustomError } = require("../errors/customError");

module.exports = {
  login: async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Login"
        #swagger.description = 'Login with username (or email) and password for get simpleToken and JWT'
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                "username": "test",
                "password": "aA?123456",
            }
        }
    */
    const { username, email, password } = req.body;

    if (password && (username || email)) {
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (user && user.password == passwordEncrypt(password)) {
        if (user.isActive) {
          //* SIMPLE TOKEN \\
          let tokenData = await Token.findOne({ userId: user._id }); // Bu user'a ait token var mi yok mu kontrol et varsa olani döndürür.
          if (!tokenData) {
            // usera ait token bilgisi yoksa yenisini olustur
            tokenData = await Token.create({
              userId: user._id,
              token: passwordEncrypt(user._id + Date.now()),
            });
          }
          //* SIMPLE TOKEN \\

          //! JWT TOKEN \\
          //^ ACCESS TOKEN \\
          const accessInfo = {
            key: process.env.ACCESS_KEY,
            time: process.env.ACCESS_EXP || "30m",
            data: {
              _id: user._id,
              username: user.username,
              email: user.email,
              password: user.password,
              isActive: user.isActive,
              isStaff: user.isStaff,
              isAdmin: user.isAdmin,
            },
          };

          //^ REFRESH TOKEN \\
          const refreshInfo = {
            key: process.env.REFRESH_KEY,
            time: process.env.REFRESH_EXP || "1d",
            data: {
              _id: user._id,
              password: user.password,
            },
          };
          //* jwt.sign(data,secret_key) \\
          const accessToken = jwt.sign(accessInfo.data, accessInfo.key, {
            expiresIn: accessInfo.time,
          });
          const refreshToken = jwt.sign(refreshInfo.data, refreshInfo.key, {
            expiresIn: refreshInfo.time,
          });

          res.status(200).send({
            error: false,
            token: tokenData.token,
            bearer: {
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
            user,
          });
        } else {
          throw new CustomError(
            "Please enter username/email and password!",
            401
          );
        }
      } else {
        throw new CustomError("Wrong username/email or password!", 401);
      }
    } else {
      throw new CustomError("Please enter username/email and password", 401);
    }
  },
  refresh: async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "JWT : Refresh"
        #swagger.description = 'Refresh token.'
    */

    const refreshToken = req.body?.bearer.refresh;
    if (refreshToken) {
      const refreshData = jwt.verify(refreshToken, process.env.REFRESH_KEY);
      if (refreshData) {
        const user = await User.findOne({ _id: refreshData._id });
        if (user && user.password == refreshData.password) {
          res.status(200).send({
            error: false,
            bearer: {
              access: jwt.sign(user.JSON(), process.env.ACCESS_KEY, {
                expiresIn: process.env.ACCESS_EXP,
              }),
            },
          });
        } else {
          throw new CustomError("Wrong data!", 401);
        }
      } else {
        throw new CustomError("Refresh data is wrong!", 401);
      }
    } else {
      throw new CustomError("Please enter refresh token!", 401);
    }
  },
  logout: async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "simpleToken: Logout"
        #swagger.description = 'Delete token key.'
    */
    //* 1. yöntem (Tüm oturumlari kapatir yani tüm tokenlari siler not: userId bizim kurgumuzda unique oldugu icin!!!)
    // const deleted = await Token.deleteOne({ userId: req.user._id });

    // res.status(deleted.deletedCount > 0 ? 200 : 404).send({
    //   error: !deleted.deletedCount,
    //   deleted,
    //   message: deleted.deletedCount > 0 ? "Logout OK" : "Logout Failed!",
    // });
    // console.log(req.user);

    //* 2. yöntem (Tüm oturumlari kapatir yani tüm tokenlari siler)
    // const deleted = await Token.deleteMany({ userId: req.user._id });
    // console.log(req.user);

    //* 3. yöntem (Tek bir oturumu kapatir yani tek bir tokeni siler)
    const auth = req.headers?.authorization;
    const tokenKey = auth ? auth.split(" ") : null;

    let deleted = null;
    if (tokenKey && tokenKey[0] == "Token") {
      deleted = await Token.deleteOne({ token: tokenKey[1] });
      res.status(deleted?.deletedCount > 0 ? 200 : 400).send({
        error: !deleted?.deletedCount,
        deleted,
        message: deleted?.deletedCount > 0 ? "Logout Ok" : "Logout Failed",
      });
    } else {
      res.send({
        error: false,
        message: "Logout Ok!",
      });
    }
  },
};

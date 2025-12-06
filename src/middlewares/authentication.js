"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Token = require("../models/token");

// Convert jwt.verify to promise-based
const jwtVerify = promisify(jwt.verify);

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers?.authorization;
    const tokenKey = auth ? auth.split(" ") : null;

    if (tokenKey && tokenKey.length >= 2) {
      //* Simple Token
      if (tokenKey[0] == "Token") {
        //* "Token asdaırhıawerasd...""
        const tokenData = await Token.findOne({
          token: tokenKey[1],
        }).populate("userId");
        req.user = tokenData && tokenData.userId ? tokenData.userId : null;
      } else if (tokenKey[0] == "Bearer") {
        //* JWT:
        try {
          const accessData = await jwtVerify(
            tokenKey[1],
            process.env.ACCESS_KEY
          );
          if (accessData) {
            console.log("JWT verified");
            req.user = accessData;
          } else {
            console.log("JWT not verified - no access data");
            req.user = null;
          }
        } catch (error) {
          console.log("JWT not verified - error:", error.message);
          req.user = null;
        }
      } else {
        req.user = null;
      }
    } else {
      req.user = null;
    }
  } catch (error) {
    console.error("Authentication middleware error:", error);
    req.user = null;
  }

  next();
};

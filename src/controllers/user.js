"use strict";
const sendMail = require("../helpers/sendMail");
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const User = require("../models/user");

module.exports = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "List Users"
        #swagger.description = `
            You can send query with endpoint for filter[], search[], sort[], page and limit.
            <ul> Examples:
                <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                <li>URL/?<b>page=2&limit=1</b></li>
            </ul>
        `
    */
    const data = await res.getModelList(User);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User),
      totalRecords: data.length,
      data,
    });
  },
  create: async (req, res) => {
    /*
         #swagger.tags = ["Users"]
         #swagger.summary = "Create User"
     */
    const data = await User.create(req.body);

    sendMail(
      data.email,
      "Welcome to the Bloggy Website",
      `<h1>Welcome ${data.username}</h1> <p>Your account successfully created</p>`
    );
    res.status(201).send({
      error: false,
      message: "User successfully created",
      data,
    });
  },
  read: async (req, res) => {
    /*
          #swagger.tags = ["Users"]
          #swagger.summary = "Get Single User"
      */
    // Single
    const data = await User.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Update User"
    */
    const data = await User.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      message: "User successfully updated",
      new: data,
      new: await User.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Delete User"
    */
    const data = await User.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 200 : 404).send({
      error: !data.deletedCount,
      message: data.deletedCount
        ? "User successfully deleted"
        : "User not found!",
      data,
    });
  },
};

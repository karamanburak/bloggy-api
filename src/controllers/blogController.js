//*Blog Controller

const { BlogPost } = require("../models/blogModel");

module.exports.BlogPostController = {
  list: async (req, res) => {
    const data = await BlogPost.find();

    res.status(200).send({
      error: false,
      blogs: data,
    });
  },
  create: async (req, res) => {
    const data = await BlogPost.create(req.body);

    res.status(201).send({
      error: false,
      blog: data,
    });
  },
};

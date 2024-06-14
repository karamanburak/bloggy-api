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
  createMany: async (req, res) => {
    const data = await BlogPost.insertMany(req.body.blogs); //* Çoklu veri create etmek için kullanılan yöntem
    //* çoklu veri gönderilirken veriyi json formatında gönderiyoruz:
    //     {
    //         "blogs": [
    //     {
    //       "title": "Blog Title 7",
    //       "content": "Blog Content 7",
    //       "published": false
    //     },
    //     {
    //       "title": "Blog Title 8",
    //       "content": "Blog Content 8",
    //       "published": false
    //     },
    //     {
    //       "title": "Blog Title 9",
    //       "content": "Blog Content 9",
    //       "published": false
    //     }
    //   ]
    // }
    res.status(201).send({
      error: false,
      blog: data,
    });
  },
};

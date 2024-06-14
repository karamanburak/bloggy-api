//*Blog Controller
require("express-async-errors")
const { BlogPost } = require("../models/blogModel");

module.exports.BlogPostController = {
    list: async (req, res) => {
        // const data = await BlogPost.find({ published: false });
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
    read: async (req, res) => {
        // const data = await BlogPost.findById(req.params.id); //* sadece id secenegini kabul eder
        // const data = await BlogPost.findOne({ published: false }); //* ilk false olan blogu getirir
        const data = await BlogPost.findOne({ _id: req.params.id }); //* diger secenekleri de kabul eder

        res.status(200).send({
            error: false,
            blog: data,
        });
    },
    update: async (req, res) => {
        // const data = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true }); // { new: true } => return new data
        const data = await BlogPost.updateOne({ _id: req.params.id }, req.body) //* datayı döndürmez yaptığı işlemin özetini döner. O nedenle bu yöntemde newData şeklinde sorgu yazıp güncellenmiş halini gönderebiliriz
        res.status(202).send({
            error: false,
            blog: data,
            newData: await BlogPost.findOne({ _id: req.params.id })
        });
    },

    delete: async (req, res) => {
        // const data = await BlogPost.findByIdAndDelete(req.params.id)
        // if (data) {
        //     // res.sendStatus(204)
        //     res.status(200).send({
        //         error: false,
        //         message: "Blog post successfully deleted",
        //         deletedData: data
        //     })
        // } else {
        //     res.sendStatus(404)
        // }

        const data = await BlogPost.deleteOne({ _id: req.params.id })
        console.log(data)
        // res.sendStatus(data.deletedCount ? 204 : 404);
        if (data.deletedCount) {
            res.sendStatus(204)
        } else {
            res.status(404).send({
                error: false,
                message: "Blog post not found",
            })
        }

    },

    deleteMany: async (req, res) => {
        const data = await BlogPost.deleteMany()
        res.status(200).send({
            error: false,
            message: "All Blog post successfully deleted",
        })
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

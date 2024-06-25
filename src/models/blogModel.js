//? Blog Models
const mongoose = require("mongoose");

// const nameSchema = new mongoose.Schema(
//   {
//     //_id : Auto Generated
//     // fieldName: String, // shorthand
//     fieldName: {
//       type: String, // Veri Tipi
//       default: "true", // veri gelmezse eklenecek deger
//       required: true, // Gelen veriden zorunlu olarak olsun mu ?
//       required: [true, "Error-Message"], //* Hata mesajını özelleştirme
//       trim: true, // Gelen veriyi trimden geçir
//       unique: true, // Benzersiz olmalı
//       index: true, // Daha hızlı erişim olsun mu ?
//       select: true, // Data çağrıldığında bu alan gelsin mi gelmesin mi ?
//       validate: [
//         function (data) {
//           return true;
//         },
//         "Error-Message",
//       ], //* veriyi kontrolden geçiren fonksiyon
//       enum: [["0", "1", "2", "3"], "error-message"], //* Choices / Pattern / Limit
//       get: function (data) {
//         return data;
//       }, // Data çağrılırken çalışan fonksiyon
//       set: function (data) {
//         return data;
//       }, // Datayı kaydederken çalışan fonksiyon
//     },
//   },
//   {
//     collection: "collectionName",
//     timestamps: true, // CreatedAt ve UpdatedAt auto
//   }
// );

const blogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true
  }
}, {
  collection: "blogCategory",
  timestamps: true,
})

const blogPostSchema = new mongoose.Schema(
  {
    // _id
    blogCategoryId: {
      type: mongoose.Schema.Types.ObjectId, //ForeingKey, relationalId
      required: true,
      ref: "BlogCategory",
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    // createdAt
    // updatedAt
  },
  {
    collection: "blogPosts",
    timestamps: true,
  }
);

//^ Export 1. yol
// const BlogPostModel = mongoose.model("blogPost", blogPostSchema);

// module.exports = {
//   BlogPost: BlogPostModel,
// };

//^ Export 2. yol
module.exports = {
  BlogPost: mongoose.model("BlogPost", blogPostSchema),
  BlogCategory: mongoose.model("BlogCategory", blogCategorySchema),
};

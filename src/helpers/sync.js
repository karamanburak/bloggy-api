"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
// sync():

module.exports = async function () {

    // return null;

    /* REMOVE DATABASE *
    const { mongoose } = require('../configs/dbConnection')
    await mongoose.connection.dropDatabase()
    console.log('- Database and all data DELETED!')
    /* REMOVE DATABASE */

    const User = require('../models/user')
    const Category = require('../models/category');
    const Blog = require('../models/blog');
    const Comment = require('../models/comment');

    /* User */
    await User.deleteMany() // !!! Clear collection.
    await User.create({
        "_id": "65343222b67e9681f937f001",
        "username": "admin",
        "password": "Password1!",
        "email": "admin@site.com",
        "firstName": "admin",
        "lastName": "admin",
        "isActive": true,
        "isStaff": true,
        "isAdmin": true
    })
    await User.create({
        "_id": "65343222b67e9681f937f002",
        "username": "staff",
        "password": "Password1!",
        "email": "staff@site.com",
        "firstName": "staff",
        "lastName": "staff",
        "isActive": true,
        "isStaff": true,
        "isAdmin": false
    })
    await User.create({
        "_id": "65343222b67e9681f937f003",
        "username": "test",
        "password": "Password1!",
        "email": "test@site.com",
        "firstName": "test",
        "lastName": "test",
        "isActive": true,
        "isStaff": false,
        "isAdmin": false
    })
    console.log('Users created');


    // Create initial categories
    const category2 = await Category.create({ name: 'World' });
    const category1 = await Category.create({ name: 'Technology' });
    const category3 = await Category.create({ name: 'Health' });
    const category4 = await Category.create({ name: 'Travel' });
    const category5 = await Category.create({ name: 'Sport' });
    const category6 = await Category.create({ name: 'Cinema' });
    const category7 = await Category.create({ name: 'Design' });
    const category8 = await Category.create({ name: 'Entertainment' });
    const category9 = await Category.create({ name: 'Business' });
    const category10 = await Category.create({ name: 'Politics' });
    const category11 = await Category.create({ name: 'Science' });
    const category12 = await Category.create({ name: 'Food' });
    console.log('Categories created');


    // Create initial blogs
    const blog1 = await Blog.create({
        userId: "65343222b67e9681f937f001",
        categoryId: "66b341bd184b94be0d924816",
        title: 'First Blog',
        content: 'This is the content of the first blog.',
        image: 'https://example.com/image1.jpg',
        isPublish: true
    });

    const blog2 = await Blog.create({
        userId: "65343222b67e9681f937f002",
        categoryId: "66b341bd184b94be0d924816",
        title: 'Second Blog',
        content: 'This is the content of the second blog.',
        image: 'https://example.com/image2.jpg',
        isPublish: true
    });
    console.log('Blogs created');


    // Create initial comments
    await Comment.create({
        userId: "65343222b67e9681f937f003",
        blogId: "66b3457b09172cb05013d9dc",
        comment: 'Great blog!',
    });

    await Comment.create({
        userId: "65343222b67e9681f937f003",
        blogId: "66b3457b09172cb05013d9dc",
        comment: 'Very informative.',
    });
    console.log('Comments created');


    /* Finished */
    console.log('Initial data created');

}
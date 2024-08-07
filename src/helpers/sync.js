"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
// sync():

module.exports = async function () {

    return null;

    /* REMOVE DATABASE *
    const { mongoose } = require('../configs/dbConnection')
    await mongoose.connection.dropDatabase()
    console.log('- Database and all data DELETED!')
    /* REMOVE DATABASE */

    const User = require('../models/user');
    const Token = require('../models/token');
    const Category = require('../models/category');
    const Blog = require('../models/blog');
    const Comment = require('../models/comment');

    /* User */
    const User = require('../models/user')
    await User.deleteMany() // !!! Clear collection.
    await User.create({
        "_id": "65343222b67e9681f937f001",
        "username": "admin",
        "password": "aA?123456",
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
        "password": "aA?123456",
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
        "password": "aA?123456",
        "email": "test@site.com",
        "firstName": "test",
        "lastName": "test",
        "isActive": true,
        "isStaff": false,
        "isAdmin": false
    })

    // Create initial categories
    const category1 = await Category.create({ name: 'Technology' });
    const category2 = await Category.create({ name: 'World' });
    const category3 = await Category.create({ name: 'Health' });
    const category4 = await Category.create({ name: 'Travel' });
    const category5 = await Category.create({ name: 'Sport' });
    const category6 = await Category.create({ name: 'Cinema' });

    // Create initial blogs
    const blog1 = await Blog.create({
        userId: adminUser._id,
        categoryId: category1._id,
        title: 'First Blog',
        content: 'This is the content of the first blog.',
        image: 'https://example.com/image1.jpg',
        isPublish: true
    });

    const blog2 = await Blog.create({
        userId: staffUser._id,
        categoryId: category2._id,
        title: 'Second Blog',
        content: 'This is the content of the second blog.',
        image: 'https://example.com/image2.jpg',
        isPublish: true
    });

    // Create initial comments
    await Comment.create({
        userId: testUser._id,
        blogId: blog1._id,
        comment: 'Great blog!',
    });

    await Comment.create({
        userId: adminUser._id,
        blogId: blog2._id,
        comment: 'Very informative.',
    });

    /* Finished */
    console.log('Initial data created');

}
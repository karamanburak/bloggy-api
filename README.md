# Bloggy App Backend

- [Bloggy Api Live](https://bloggy-api-v8e5.onrender.com/)
- [Bloggy App Live](https://bloggiie.vercel.app/)

## Description

This is the backend for the Bloggy App, a web application that allows users to create, edit, and interact with blog posts. This backend handles user authentication, blog management, and interactions using Node.js, Express, and MongoDB.

## Features

- User Authentication: Secure user sign-up and login using token-based authentication.
- Create Blog Posts: Users can create, save as drafts, and publish blog posts.
- Edit Profile: Users can update their profile information.
- Interact with Blogs: Users can like/unlike blog posts and leave comments.
- Drafts: Users can save blog posts as drafts and view them on their private page.

## Tech Stack

- Backend: Node.js, Express
- Database: MongoDB
- Authentication: Token

## API Endpoints

### Authentication

| Method | Url              | Decription | Sample Valid Request Body |
| ------ | ---------------- | ---------- | ------------------------- |
| POST   | /api/users/      | Sign up    | [JSON](#signup)           |
| POST   | /api/auth/login  | Sign in    | [JSON](#signin)           |
| GET    | /api/auth/logout | Sign out   |                           |

### User Profile

| Method | Url           | Description                                        | Sample Valid Request Body |
| ------ | ------------- | -------------------------------------------------- | ------------------------- |
| GET    | /api/user/:id | Get the current user's profile                     |                           |
| PUT    | /api/user/:id | Update user (If profile belongs to logged in user) | [JSON](#userupdate)       |

### Interactions

| Method | Url                     | Description                                  | Sample Valid Request Body |
| ------ | ----------------------- | -------------------------------------------- | ------------------------- |
| GET    | api/comments/           | Get all comments                             |                           |
| POST   | api/comments/           | Comment on a blog post                       | [JSON](#postcomment)      |
| POST   | /api/blogs/:id/postLike | Like and dislike a blog (if there is a user) |                           |

### Blog Posts

| Method | Url                  | Description                                  | Sample Valid Request Body |
| ------ | -------------------- | -------------------------------------------- | ------------------------- |
| GET    | /api/blogs           | Get all public blog posts                    |                           |
| GET    | /api/blogs?author=id | Get all draft blog posts of the current user |                           |
| GET    | /api/blogs/:id       | Get a single blog detail by ID               |                           |
| POST   | /api/blogs/          | Create a new blog post                       | [JSON](#postblog)         |
| PUT    | /api/blogs/:id       | Update a blog post by ID                     | [JSON](#updateblog)       |
| DELETE | /api/blogs/:id       | Delete a blog post by ID                     |                           |

## Usage

### Register and Login

- Register a new account:
- Send a POST request to /api/users with user details.

### Login with the registered account:

- Send a POST request to /api/auth/login to receive a token.

### Creating a Blog Post

- Create a new blog post:
- Send a POST request to /api/blogs with the blog post data.
- Save as draft or publish:
- Include a status field in the blog post data to mark it as draft or public.

### Managing Blog Posts

- View and edit drafts:
- Send a GET request to /api/blogs/:id to view drafts.
- Edit or delete public posts:
- Send a PUT request to /api/blogs/:id to update a post.
- Send a DELETE request to /api/blogs/:id to delete a post.

## Interacting with Other Users

- Like or unlike a blog post:
  Send a POST request to /api/blogs/:id/postLike
- Leave comments:
  Send a POST request to /api/comments/ with the comment data.

## Sample Valid JSON Request Bodys

##### <a id="signup">Sign Up -> /api/users/ </a>

```json
{
  "username": "TestUsers1",
  "firstName": "test9999s",
  "lastName": "9999test",
  "email": "test1231s@aa.com",
  "image": "https://avatars.githubusercontent.com/u/9303062",
  "city": "Potsdam",
  "bio": "I'm fullstack developer.",
  "password": "Qwertyu5+@",
  "password2": "Qwertyu5+@"
}
```

##### <a id="signin">Log In -> /api/auth/signin</a>

```json
{
  "email": "admin@site.com",
  "password": "Potsdam*123"
}
```

##### <a id="userupdate">Update User -> /api/users/:id</a>

```json
{
  "username": "TestUsers176s",
  "firstName": "test9999s",
  "lastName": "9999test",
  "email": "test1231s@aa.com",
  "image": "https://avatars.githubusercontent.com/u/93030628?v=4",
  "city": "Ankara",
  "bio": "I'm fullstack developer."
}
```

##### <a id="postblog">Create Blog -> /api/blogs/</a>

```json
{
  "title": "ChatGPT 4o",
  "content": "Introduction OpenAI has just unveiled GPT-4o, their latest flagship model that promises to change the way we interact with artificial intelligence. This new model, described as “omni” for its versatile capabilities, can process and generate text, audio, and images in real time. If you’re excited about technological advancements or curious about AI, this announcement is a game-changer. Let’s explore what GPT-4o is and why it’s such a big deal. Discover the ultimate all-in-one marketing platform sytememe.io absolutely free by visiting their Official Website. Create sales funnels, send emails, build websites, manage affiliates, offer online courses, and automate your marketing effortlessly. What is OpenAI? OpenAI is a pioneering research organization dedicated to developing AI technologies that benefit humanity. Since its inception in 2015, OpenAI has been at the forefront of AI innovation, delivering transformative technologies like the GPT series. ",
  "image": "https://tecnosoluciones.com/wp-content/uploads/2023/12/como-crear-imagenes-con-ChatGPT.png",
  "categoryId": "6591ef8d26959a81bce92d5a",
  "isPublish": "true"
}
```

##### <a id="updateblog">Update Blog -> /api/blogs/:id</a>

```json
{
  "_id": "6596c9b7fe3c451733649382",
  "userId": "6596a2a7fe3c4517336492ce",
  "categoryId": "6591ef8d26959a81bce92d5a",
  "title": "ChatGPT 4o",
  "content": "Introduction OpenAI has just unveiled GPT-4o, their latest flagship model that promises to change the way we interact with artificial intelligence. This new model, described as “omni” for its versatile capabilities, can process and generate text, audio, and images in real time. If you’re excited about technological advancements or curious about AI, this announcement is a game-changer. Let’s explore what GPT-4o is and why it’s such a big deal. Discover the ultimate all-in-one marketing platform sytememe.io absolutely free by visiting their Official Website. Create sales funnels, send emails, build websites, manage affiliates, offer online courses, and automate your marketing effortlessly. What is OpenAI? OpenAI is a pioneering research organization dedicated to developing AI technologies that benefit humanity. Since its inception in 2015, OpenAI has been at the forefront of AI innovation, delivering transformative technologies like the GPT series.",
  "image": "https://tecnosoluciones.com/wp-content/uploads/2023/12/como-crear-imagenes-con-ChatGPT.png",
  "isPublish": "false"
}
```

##### <a id="postcomment">Create Comment -> api/comments/ </a>

```json
{
  "blogId": "6637d5fd16dfb0afed9952cc",
  "comment": "Master"
}
```

## Documentations

[View Postman Documentation](https://documenter.getpostman.com/view/32987022/2sA3s9BnRX#677d706d-bc2c-401f-9808-d56288077f3a)
[View Swagger Documentation](https://bloggy-api-v8e5.onrender.com/documents/swagger/)
[View Redoc Documentation](https://bloggy-api-v8e5.onrender.com/documents/redoc)
[View Json Documentation](https://bloggy-api-v8e5.onrender.com/documents/json)

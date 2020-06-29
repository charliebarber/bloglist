const blogsRouter = require("express").Router();
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post("/", async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return res.status(401).json({error: 'token missing'})
    }

    console.log('req token', request.token)
    console.log('decoded', decodedToken)

    const user = await User.findById(decodedToken.id)

    console.log('user', user)

    const blog = new Blog({
        url: body.url,
        title: body.title,
        author: body.author,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return res.status(401).json({error: 'token missing'})
    }

    const blog = await Blog.findById(request.params.id)

    if ( blog.user.toString() === decodedToken.id.toString() ) {
        console.log('id match')
        const deleted = await Blog.findByIdAndRemove(request.params.id)
        response.status(200).json(deleted)
    }
})

blogsRouter.put("/:id", async (request, response) => {
    const body = request.body

    const blog = {
        likes: body.likes
    }

    const updated = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.status(200).json(updated)
})

module.exports = blogsRouter;

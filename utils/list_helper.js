const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes,0)
}

const favouriteBlog = (blogs) => {
    const mostLikes = blogs.reduce((highestLikes, blog) => blog.likes > highestLikes ? highestLikes = blog.likes : highestLikes = highestLikes , 0 )
    return blogs.filter((blog) => blog.likes === mostLikes)[0]
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog.save().then((result) => {
    response.status(201).json(result)
  }).catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body

  Blog.findById(request.params.id)
    .then((blog) => {
      if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
      }

      blog.title = title
      blog.author = author
      blog.url = url
      blog.likes = likes

      return blog.save()
    })
    .then((updatedBlog) => {
      response.json(updatedBlog)
    })
    .catch((error) => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => {
      next(error)
    })
})

module.exports = blogsRouter
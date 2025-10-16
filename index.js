require('dotenv').config()

const express = require('express')

const mongoose = require('mongoose')
// const cors = require('cors')

const app = express()

app.use(express.static('dist'))
// app.use(cors())

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

// const mongoUrl = 'mongodb://localhost/bloglist'
const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!')
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:', error.message)
  })

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

app.put('/api/blogs/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body

  Blog.findById(request.params.id)
    .then(blog => {
      if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
      }

      blog.title = title
      blog.author = author
      blog.url = url
      blog.likes = likes

      return blog.save()
    })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

app.delete('/api/blogs/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id).then(() => response.status(200).end()).catch(error => {
    next(error)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const _ = require('lodash')

const dummy = (blogs) => {
  if(blogs){
    return 1
  }
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((fav, cur) => fav.likes > cur.likes ? fav : cur)
}

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, 'author')
  const authorWithMostBlogs = _.maxBy(_.keys(authorCounts), author => authorCounts[author])
  return { author: authorWithMostBlogs, blogs: authorCounts[authorWithMostBlogs] }
}

const mostLikes = (blogs) => {
  const authorsGrouped = _.groupBy(blogs, 'author')

  // Method 1: Using _.mapValues to sum likes for each author
  const authorTotals = _.mapValues(authorsGrouped, authorBlogs =>
    _.sumBy(authorBlogs, 'likes')
  )

  // Find the author with the most total likes
  const authorWithMostLikes = _.maxBy(_.keys(authorTotals), author => authorTotals[author])
  return { author: authorWithMostLikes, likes: authorTotals[authorWithMostLikes] }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
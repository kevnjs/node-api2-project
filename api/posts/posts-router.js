// implement your posts router here
const express = require('express');
const posts = require('./posts-model')
const router = express.Router(); 


// GET api/posts
router.get('/', (req, res) => {
   posts.find()
   .then(allPosts => res.json(allPosts))
   .catch(() => res.status(500).json({message: "The posts information could not be retrieved"}))
})

//GET api/posts/:id
router.get('/:id', (req, res) => {
   const { id } = req.params;
   posts.findById(id)
   .then(post => post?.id ? res.json(post) : res.status(404).json({message: "The post with the specified ID does not exist"}))
   .catch(() => res.status(500).json({message: "The post information could not be retrieved"}))
})

//POST api/posts
router.post('/', (req, res) => {
   if(!("title" in req.body) || !("contents" in req.body)) return res.status(400).json({message: "Please provide title and contents for the post"})
   posts.insert(req.body)
   .then(post => res.status(201).json(post))
   .catch(() => res.status(500).json({message: "There was an error while saving the post to the database"}))
})

//PUT api/posts/:id
router.put('/:id', (req, res) => {
   posts.findById(req.params.id)
   .then(post => {
      if(!post)return res.status(404).json({message: "The post with the specified ID does not exist"})
      if(!("title" in req.body) || !("contents" in req.body)) return res.status(400).json({message: "Please provide title and contents for the post"})
      posts.update(req.params.id, req.body)
      .then(() => posts.findById(req.params.id).then(post => res.status(200).json(post)))
      .catch(() =>res.status(500).json({message: "The post information could not be modified"}))
   })  
})

//DELETE api/posts/:id
router.delete('/:id', (req, res) => {
   posts.findById(req.params.id)
   .then(post => {
      if(!post) return res.status(404).json({message: "The post with the specified ID does not exist"})
      posts.remove(req.params.id).then(res.json(post))
   })
   .catch(() => res.status(500).json({message: "The post could not be removed"}))
})
//GET api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
   posts.findById(req.params.id).then(post => {
      if(!post)return res.status(404).json({message: "The post with the specified ID does not exist"})
      posts.findPostComments(req.params.id).then(comment => {
         // if(!comment) return res.status(404).json({message: "The post with the specified ID does not exist"})
         // console.log(comment)
         res.json(comment)
      })
      .catch(() => res.status(500).json({message: "The comments information could not be retrieved"}))
   })

})



module.exports = router;

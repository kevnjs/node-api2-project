// implement your posts router here
const express = require('express');
const posts = require('./posts-model')
const router = express.Router(); 



router.get('/', (req, res) => {
    posts.find()
    .then(post => res.status(200).json(post))
    .catch(() => res.status(500).json({message: "The posts information could not be retrieved"}))
});

router.post('/', (req, res) => { //Works
    if(!req.body.title || !req.body.contents) 
    return res.status(400).json({message: "Please provide title and contents for the post"})
    posts.insert(req.body)
    .then(post => res.status(201).json(post))
    .catch(() => res.status(500).json({message: "Cannot Post"}))
})

router.get('/:id', (req, res) => { //Works
    posts.findById(req.params.id)
    .then(post => {
        if(post)return res.status(200).json(post)
        if(!post) return res.status(404).json({message: "The post with the specified ID does not exist"})
    })
    .catch(() => res.status(500).json({message: "he post information could not be retrieved"}))
})

router.put('/:id', async (req, res) => {
    try {
        const data = await posts.update(req.params.id, req.body)
        const id = await posts.findById(req.params.id)
        if(!req.body.title || !req.body.contents) return res.status(400).json({message: "Please provide title and contents for the post"})
        if(!id) return res.status(404).json({message: "The post with the specified ID does not exist"})
        res.json(req.body);
    }
    catch {
        res.status(500).json({message: "The post information could not be modified"})
    }
})



router.delete('/:id', async (req, res) => {
    try{
        const id = await posts.remove(req.params.id)
        if(!id) return res.status(404).json({message: "The post with the specified ID does not exist"})
        res.json(id)
    }
    catch{
        res.status(500).json({message: "The post could not be removed"})
    }
})

router.get('/:id/comments', async (req, res) => {
    try{
        if(!req.params.id) return res.status(404).json({message: "The post with the specified ID does not exist" })
        const comments = await posts.findPostComments(req.params.id)
        return res.json(comments)
    }
    catch{
        res.status(500).json({message: "The comments information could not be retrieved"})    }
})

module.exports = router;

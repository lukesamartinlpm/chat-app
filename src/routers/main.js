const express = require('express')
const router = express.Router()
router.get('/chat',(req,res)=>{
    res.render('chat',{
        title:'Chat app',
    })
})

router.get('',(req,res)=>{
    res.render('index')
})


module.exports = router
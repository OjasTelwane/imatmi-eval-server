const express = require('express');
const bigFiveQuestions = require('../models/bigFiveQuestions');
const router = express.Router();

router.get('/getQuestions', (req, res) => {
    bigFiveQuestions.find().then((data)=>{
        res.status(200).send(data);
    }).catch((err)=>{
        console.log(err);
    })
});

router.get('/getQuestions/:id', (req, res) => {
    bigFiveQuestions.findById(id).then((data)=>{
        res.status(200).send(data);
    }).catch((err)=>{
        console.log(err);
    })
});

router.post('getQuestions/add', async(req, res) => {
    console.log('added five');
    // const newQuestion = req.body;
    // try {
    //     const question = new bigFiveQuestions(newQuestion);
    //     question.save();
    //     res.status(200);
    // } catch(err) {
    //     res.status(500).send('server error');
    // }
});

module.exports = router;

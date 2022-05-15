const express = require('express');
const router = express.Router();
const Logs = require('../models/Logs');

// router.get('/logs', (req, res) => {
//     Logs.find().then((data) => {
//         res.status(200).send(data);
//     }).catch((err)=> {
//         console.log(err);
//     })
// })

module.exports = router;

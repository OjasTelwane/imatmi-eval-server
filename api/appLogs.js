const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

router.get('/download', (req, res) => {
    const file = '/logs/2021-12-06.log';
    try{
        res.download(file);
        logger.info('Log file download');
    }
    // /
    catch{
        logger.error('log file download');
      }
});

module.exports = router;

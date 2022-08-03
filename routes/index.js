//root route
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
      message: 'You are in the REST API Project',
    });
  });

module.exports = router;
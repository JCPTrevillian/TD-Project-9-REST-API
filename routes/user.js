'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// authenticatedUser first/last/email 
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddress,
    });
}));

// user, 201 (200 OK) 
router.post('/', asyncHandler(async (req, res, next) => {
        if (req.body.password){
           req.body.password = bcrypt.hashSync(req.body.password, 10); 
        }
        await User.create(req.body);
        res.location('/');
        res.status(201).end();
}));

module.exports = router;
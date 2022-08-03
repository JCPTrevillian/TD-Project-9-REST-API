const express = require('express');
const router = express.Router();
const { Course, User} = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// Course list incl first/last/email only 
router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include:[
            {
            model:User,
            attributes: ['firstName', 'lastName', 'emailAddress'],
            },
        ],
    });
    res.json(courses);
}));

// course, 404 ID NOT FOUND 
router.get('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include:[
            {
            model:User,
            attributes: ['firstName', 'lastName', 'emailAddress'],
            },
        ],
    });
    if(course) {
        res.json(course);
    } else {
        res.status(404).json({
            message: 'Id Not Found.',
        });
    }
}));

// creates course, 201
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    res.location(`/api/courses/${course.id}`);
    res.status(201).end();
}));

// updates else 204, 403, or 404 (200 OK/400 Bad Request) 
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    let course = await Course.findByPk(req.params.id);
    if(course && (user.id === course.userId)) {
        await course.update(req.body);
        res.status(204).end();
    } else if(course && (user.id !== course.userId)) {
        res.status(403).json({
            message: 'Sorry, update option limited to courses you own.'
        })
    } else {
        res.status(404).json({
            message: `Sorry, course id ${req.params.id} could not be found. Please try again.`
        });
    }
}));

// delete course 204, 403, or 404 (200 OK/400 Bad Request)
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    let course = await Course.findByPk(req.params.id);
    if (course && (user.id === course.userId)) {
        await course.destroy();
        res.status(204).end();
    } else if(course && (user.id !== course.userId)) {
        res.status(403).json({
            message: 'Sorry, course deletion limited to courses you own.'
        }); 
    } else {
        res.status(404).json({
            message: `Sorry, course id ${req.params.id} could not be found. Please try again.`
        });
    }
}));


module.exports = router;
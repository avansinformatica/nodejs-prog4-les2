const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const userController = require('../controllers/user.controller')
const database = require('../dao/inmem-db') // Replace '../path/to/database' with the actual path to your database module or object
const userService = require('../services/user.service')

// Importeer de juiste database-module of -object





// Tijdelijke functie om niet bestaande routes op te vangen
const notFound = (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Route not found',
        data: {}
    })
}

// Input validation functions for user routes
const validateUserCreate = (req, res, next) => {
    if (!req.body.emailAdress || !req.body.firstName || !req.body.lastName) {
        return res.status(400).json({
            status: 400,
            message: 'Missing email or password',
            data: {}
        })
    }
    next()
}

// Input validation function 2 met gebruik van assert
const validateUserCreateAssert = (req, res, next) => {
    try {
        assert(req.body.emailAdress, 'Missing email')
        assert(req.body.firstName, 'Missing first name')
        assert(req.body.lastName, 'Missing last name')
        next()
    } catch (ex) {
        return res.status(400).json({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

// Input validation function 2 met gebruik van assert
const validateUserCreateChaiShould = (req, res, next) => {
    try {
        req.body.firstName.should.not.be.empty.and.a('string')
        req.body.lastName.should.not.be.empty.and.a('string')
        req.body.emailAdress.should.not.be.empty.and.a('string').and.match(/@/)
        next()
    } catch (ex) {
        return res.status(400).json({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

const validateEmail = (req, res, next) => {
    try {
        const email = req.body.emailAdress;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new Error('Invalid email address');
        }
        next();
    } catch (ex) {
        return res.status(400).json({
            status: 400,
            message: ex.message,
            data: {}
        });
    }
};

const validateUniqueEmail = (req, res, next) => {
    const email = req.body.emailAdress;
    database.findUserByEmail(email, (err, existingUser) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: err.message,
                data: {}
            });
        }
        if (existingUser) {
            return res.status(400).json({
                status: 400,
                message: 'User already exists',
                data: {}
            });
        }
        next();
    });
};



const validateUserCreateChaiExpect = (req, res, next) => {
    try {
        chai.expect(req.body.firstName).to.not.be.empty
        chai.expect(req.body.firstName).to.be.a('string')
        next()
    } catch (ex) {
        return res.status(400).json({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

// Userroutes
router.post('/api/users', validateUserCreateAssert, validateEmail, validateUniqueEmail, userController.create)
router.get('/api/users', userController.getAll)
router.get('/api/users/:userId', userController.getById)

// Tijdelijke routes om niet bestaande routes op te vangen
router.put('/api/users/:userId', notFound)
router.delete('/api/users/:userId', notFound)


module.exports = router


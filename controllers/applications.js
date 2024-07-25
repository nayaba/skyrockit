const express = require('express')
const router = express.Router()

const User = require('../models/user')

router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        res.render('applications/index.ejs', {
            applications: currentUser.applications
        })
    } catch(error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/new', async (req, res) => {
    res.render('applications/new.ejs')
})

router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        req.body.date = new Date(req.body.date)
        currentUser.applications.push(req.body)
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/applications`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/:applicationId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const application = currentUser.applications.id(req.params.applicationId)
        res.render('applications/show.ejs', {
            application
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.delete('/:applicationId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        currentUser.applications.id(req.params.applicationId).deleteOne()
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/applications`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

module.exports = router
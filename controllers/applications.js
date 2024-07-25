/* eslint-disable prefer-destructuring */
const express = require('express');

const router = express.Router();

const User = require('../models/user');

const VALID_STATUS = ['Interested', 'Applied', 'Interviewing', 'Rejected', 'Accepted'];

router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const applications = currentUser.applications;

    res.render('applications/index.ejs', { applications });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/new', async (req, res) => {
  res.render('applications/new.ejs');
});

router.post('/', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.session.user._id);

    req.body.date = new Date(req.body.date);
    currentUser.applications.push(req.body);

    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/applications`);
  } catch (err) {
    console.error(err);

    res.redirect('/');
  }
});

router.get('/:applicationId', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const applications = currentUser.applications;

    // in order to pull one specific object from the
    // embedded array, we need to use the id method
    // which will call arr.find id === req.params.id
    res.render('applications/show.ejs', {
      application: applications.id(req.params.applicationId),
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

router.delete('/:applicationId', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.session.user._id);

    const application = currentUser.applications.id(req.params.applicationId);

    application.deleteOne();

    await currentUser.save();

    res.redirect('/');
  } catch (error) {
    console.log(error);

    res.redirect('/');
  }
});

router.get('/:applicationId/edit', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.session.user._id);

    const application = currentUser.applications.id(req.params.applicationId);

    res.render('applications/edit.ejs', { application, statusOptions: VALID_STATUS });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.put('/:applicationId', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.session.user._id);

    const application = currentUser.applications.id(req.params.applicationId);

    req.body.date = new Date(req.body.date);

    application.set(req.body);

    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/applications/${req.params.applicationId}`);
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;

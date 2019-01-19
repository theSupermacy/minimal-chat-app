var express = require('express');
var router = express.Router();
var User = require('./../modals/Users')
var responseSender = require('./../middlewares/responseSender')
const { checkSchema } = require('express-validator/check');


/* GET users listing. */
// add user validations
router.post('/', checkSchema({
  name: {
    in: ['body'],
  },
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: "Invalid Email"
    }
  },
  mobileNumber: {
    in: ['body'],
    isMobilePhone: {
      errorMessage: "Invalid Mobile"
    }
  }
}), function (req, res, next) {
  const {
    name,
    email,
    mobileNumber
  } = req.body
  const userObject = new User();
  userObject.addUser({
    name,
    email,
    mobileNumber
  }).then(data => req.sendingData = data)
    .then(() => next()).catch(next)
}, responseSender)

router.get('/', function (req, res, next) {
  console.log('Need to Implement This')
}, responseSender)

router.get('/:userId/friends', function (req, res, next) {
  const userId = req.params.userId
  const userObject = new User(userId)
  return userObject.getUserFriends(userId)
    .then(data => req.sendingData = data)
    .then(() => next()).catch(next)
}, responseSender);

router.get('/:userId', function (req, res, next) {
  const userId = req.params.userId
  const userObject = new User(userId)
  return userObject.getUserInformationById(userId)
    .then(data => req.sendingData = data)
    .then(() => next())
    .catch(next)
}, responseSender)


router.post('/:userId/friends/:friendId', function (req, res, next) {
  const userId = req.params.userId
  const friendId = req.params.friendId
  const userObject = new User(userId)
  return userObject.makeFriend(friendId)
    .then(data => req.sendingData = data)
    .then(() => next())
    .catch(next)
}, responseSender)

module.exports = router;

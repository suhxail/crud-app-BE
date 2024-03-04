const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../middleware/middleware');

router.get('/getUsers',userController.getUserList)
// router.post('/', userController.signup);

router.post('/signup', userController.signup);
router.get('/getUsers',userController.getUserList);
router.post('/signin',userController.signin);

router.get('/profile', middleware.verifyToken,userController.getProfile)
router.put('/editProfile', middleware.verifyToken, userController.editProfile);
router.delete('/deleteProfile/:id', middleware.verifyToken, userController.deleteProfile);


module.exports = router;


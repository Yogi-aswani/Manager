const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const auth = require('../Middleware/auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/getUser', userController.getUser);
router.post('/createTask', auth,userController.createTask);
router.post('/uploadFromSheet', auth,userController.uploadSheet);
router.post('/updateTaskStatus', auth,userController.updateTaskStatus);
router.get('/getMyTask', auth,userController.getMyTask);
router.get('/getMyAssignTask', auth,userController.getMyAssignTask);
router.get('/deleteTask/:id', auth,userController.deleteTask);




module.exports = router;
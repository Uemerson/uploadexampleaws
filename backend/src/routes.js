const routes = require('express').Router();

const multer = require('multer');
const multerConfig = require('./config/multer');

const PostController = require('./controllers/PostController');

routes.get('/posts', PostController.index);
routes.post('/posts', multer(multerConfig).single('file'), PostController.create);
routes.delete('/posts/:id', PostController.delete);

// routes.post('/multiple/posts', multer(multerConfig).array('file'), )

module.exports = routes;
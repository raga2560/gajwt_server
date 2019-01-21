var AuthenticationController = require('./controllers/authentication'),  
    TodoController = require('./controllers/todos'),  
    BookingController = require('./controllers/booking'),  
    PostController = require('./controllers/post'),  
    express = require('express');


module.exports = function(app){

    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        todoRoutes = express.Router();
        bookingRoutes = express.Router();
        postRoutes = express.Router();

    // Auth Routes
    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login',  AuthenticationController.login);

    authRoutes.get('/protected', AuthenticationController.authenticate, function(req, res){
        res.send({ content: 'Success'});
    });

    // Todo Routes
    apiRoutes.use('/todos', todoRoutes);

    todoRoutes.get('/', AuthenticationController.authenticate, AuthenticationController.roleAuthorization(['reader','creator','editor']), TodoController.getTodos);
    todoRoutes.post('/', AuthenticationController.authenticate, AuthenticationController.roleAuthorization(['creator','editor']), TodoController.createTodo);

    todoRoutes.delete('/:todo_id', AuthenticationController.authenticate, AuthenticationController.roleAuthorization(['editor']), TodoController.deleteTodo);


    apiRoutes.use('/booking', bookingRoutes);
    bookingRoutes.get('/getBookings',  AuthenticationController.authenticate , BookingController.getBookings);
    bookingRoutes.post('/getRookBooking',  AuthenticationController.authenticate , BookingController.getRoomBookings);
    bookingRoutes.post('/createBooking',   AuthenticationController.authenticate, BookingController.createBooking);
    bookingRoutes.get('/delete/:booking_id', AuthenticationController.authenticate, AuthenticationController.roleAuthorization(['editor']), BookingController.deleteBooking);

    bookingRoutes.get('/getBooking/:booking_id',  BookingController.getBooking);

    apiRoutes.use('/post', postRoutes);
    postRoutes.get('/getposts',  PostController.getPosts);
    postRoutes.get('/getComments/:post_id',  PostController.getComments);
    postRoutes.post('/createPost',  PostController.createPost);
    postRoutes.post('/createComment',  PostController.createComment);
    app.use('/api', apiRoutes);

}

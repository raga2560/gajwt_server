var Post = require('../models/post');

exports.getPosts = function(req, res, next){

    Post.find({},
        function(err, posts) {

        if (err){
        	res.send(err);
        }

        res.json(posts);

    });

}

exports.getComments = function(req, res, next){
    var post = req.body.post;

    Post.find({_id: post._id}, {comments: 1},
        function(err, posts) {

        if (err){
        	res.send(err);
        }

        res.json(posts);

    });

}

exports.createPost = function(req, res ){
    var postdata = req.body;


    Post.create({
        title : postdata.title,
        description : postdata.description,
        owner : postdata.owner,
        comments : [],
        done : false
    }, function(err, post) {

        console.log("err="+err);
        if (err){
        	res.send(err);
        }
        else { 
        Post.find( {_id: post._id}, function(err, posts) {

            if (err){
            	res.send(err);
            }
            else {
            res.json(posts);
            }
            

        });
       }

    });

}

exports.createComment = function(req, res ){
    var comment = req.body;


    Post.update({_id: comment.postid}, {
        $push : { comments : comment }
    }, function(err, post) {

        console.log("err="+err);
        if (err){
        	res.send(err);
        }
        else { 
        Post.find( {_id: post._id}, function(err, posts) {

            if (err){
            	res.send(err);
            }
            else {
            res.json(posts);
            }
            

        });
       }

    });
}


exports.deletePost = function(req, res, next){

    Post.remove({
        _id : req.params.post_id
    }, function(err, post) {
        res.json(post);
    });

}


exports.getPost = function(req, res, next){

    Post.find({
        _id : req.params.post_id}, 
     function(err, post) {
        if (err){
                res.send(err);
        }
        else {
        req.post = post[0]; // useful when we need to process post in next call
        res.json(post[0]);
        }
    });
}


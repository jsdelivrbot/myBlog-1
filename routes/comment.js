var async = require("async");
var Comment = require("../models/comment").Comment
var HttpError = require("../error").HttpError;



exports.post = function(req, res, next){
	var commentText = req.body.commentText;
	var page = req.body.page;
	if(!req.session.user_id){
		return next(new HttpError(403, "Ви не авторизовані"));
	}
	if(commentText.length == 0){
		return next(new HttpError(403, "Відсутні коментарі"));
	}else{
		async.waterfall([
			function(callback){
				var comment = new Comment({user: req.user._id, commentText: commentText, page: page});
				comment.save(function(err){
					if(err) return next(err);
					callback(null);
				});
			}],
			function(err){
				if(err) return next(err);
				res.send({});
			}
			);
	}
}

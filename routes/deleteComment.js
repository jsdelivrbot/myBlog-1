var async = require("async");
var User = require("../models/user").User
var Comment = require("../models/comment").Comment
var HttpError = require("../error").HttpError;


exports.post = function(req, res, next){
	var idComment = req.body.idComment;


	async.waterfall([
		function(callback){
			Comment.findById(idComment, callback);
		},
		function(comment, callback){
			if(!comment){ return next(new HttpError(403, "Коментарій не знайдено"));
		}
		if((req.session.user_id && comment.user.equals(req.session.user_id)) || req.user.status == "admin"){
			Comment.remove({ _id: idComment}, callback);
		}else{
			return next(new HttpError(403, "Щось пішло не так"));
		}
	}],
	function(err, comment){
		if(err) return next(err);
		res.send({});
	}
	);
}

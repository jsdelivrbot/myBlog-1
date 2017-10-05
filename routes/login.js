var async = require("async");
var User = require("../models/user").User
var AuthError = require("../error").AuthError;
var HttpError = require("../error").HttpError;


exports.get = function(req, res){
	res.render("login");
};

exports.post = function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;


	async.waterfall([
		function(callback){
			User.findOne({username: username}, callback);
		},
		function(user, callback){
			if(!user){ next(new AuthError(403, "user not found"));
			}else{
				if(user.checkPassword(password)){
					callback(null, user);
				}else{
					next(new AuthError(403, "password is wrong"));
				}
			}
		}],
		function(err, user){
			if(err) return next(err);
			req.session.user_id = user._id;
			res.send({});
		}
		);
}

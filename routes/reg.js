var async = require("async");
var User = require("../models/user").User
var AuthError = require("../error").AuthError;


exports.get = function(req, res){
	res.render("reg");
};

exports.post = function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
	var password_repeated = req.body.password_repeated;

	if(password !== password_repeated){
		return next(new AuthError(403, "Повторіть введення паролю"));
	}else{
		async.waterfall([
			function(callback){
				User.findOne({username: username}, callback);
			},
			function(user, callback){

				if(user){
					next(new AuthError(403, "Користувач з таким іменем вже існує"));
				}else{
					var user = new User({username: username, password: password});
					user.save(function(err){
						if(err) return next(err);
						callback(null, user)
					});
				}

			}],
			function(err){
				if(err) return next(err);
				res.send({});
			}
			);
		}
}

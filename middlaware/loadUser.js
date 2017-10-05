var User = require("../models/user").User;
var log = require('../libs/log')(module);

module.exports = function(req, res, next){
	req.user = res.locals.user = null;
	if(!req.session.user_id) return next();

	User.findById(req.session.user_id, function(err, user){
		req.user = res.locals.user = user;
		next();
	});
}
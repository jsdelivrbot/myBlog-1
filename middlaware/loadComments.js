var Comment = require("../models/comment").Comment;
var config = require('../config');
var async = require("async");

exports.loadComments = function (req, res, page) {
	var commentsOnePage = config.get("commentsOnePage");
	var skipComments = commentsOnePage * (req.query.page - 1) || 0;
	var numCommPage = req.query.page || 1;
	async.waterfall([
		function (callback) {
				Comment.count({
					page: page
				}, callback);
		},
		function (count, callback) {
				res.locals.countComments = Math.ceil(count / commentsOnePage);
				if (skipComments >= count) skipComments = 0;
				Comment.find({
					page: page
				}).populate('user', 'username').skip(skipComments).limit(commentsOnePage).exec(callback);
		}],
		function (err, comments) {
			if (err) return HttpError(err);
			res.render(page, {
				page: page,
				comments: comments,
				numCommPage: numCommPage
			});
		}
	);

}

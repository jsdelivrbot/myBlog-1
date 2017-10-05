exports.get = function(req, res){
	require("../middlaware/loadComments").loadComments(req, res, "downloader");
};
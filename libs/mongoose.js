var mongoose = require("mongoose");
var config = require("../config");

mongoose.connect(config.get("mongoose:uri"), function(err){
	console.log(err);
});


module.exports = mongoose;
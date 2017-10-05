var mongoose = require("../libs/mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
	user:{
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	commentText:{
		type: String,
		required: true
	},
	page:{
		type: String,
		required: true
	},
	created:{
		type: Date,
		default: Date.now,
		required: true
	}
});

exports.Comment = mongoose.model("Comment", schema);
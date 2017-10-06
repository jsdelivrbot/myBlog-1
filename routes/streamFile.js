var fs = require('fs');
exports.get = function (req, response) {
	var filePath = "./public/files/exampleSomeNewFileWithLongName.zip";
	var stream = new fs.ReadStream(filePath);
	var stat = fs.statSync(filePath);
	response.setHeader('Content-Length', stat.size);
	response.setHeader('Content-Type', 'image/jpg');
	//response.setHeader('Content-Disposition', 'attachment; filename=exampleSomeNewFileWithLongName.zip');

	stream.pipe(response);

};

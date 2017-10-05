module.exports = function (app) {
	

	app.get("/reg", require("./reg").get);
	app.post("/reg", require("./reg").post);

	app.get("/login", require("./login").get);
	app.post("/login", require("./login").post);

	app.get("/", require("./home").get);

	app.get("/mnSlider", require("./mnSlider").get);
	app.get("/mnCompression", require("./mnCompression").get);
	app.get("/downloader", require("./downloader").get);
	app.get("/about", require("./about").get);
	

	app.post("/comment", require("./comment").post);

	app.post("/deleteComment", require("./deleteComment").post);

	app.post("/logout", require("./logout").post);
	app.get("/streamFile", require("./streamFile.js").get);


}

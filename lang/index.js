var config = require('../config');
var fs = require('fs');
module.exports = function (req, res, next) {


	var LangListReg = new RegExp(config.get("langListRegExpStr"), 'i');

	if (LangListReg.test(req.query.lang)) {
		req.session.lang = req.query.lang;
	}

	res.locals.lang = req.session.lang || config.get("langDeault");
	var langPath = ".//lang//" + res.locals.lang + ".json",
		strData = fs.readFileSync(langPath).toString() || "{}",
		str = JSON.parse(strData),
		noLocText = config.get("noLocText");
	strData = null;

	res.locals.currentPath = req._parsedUrl.pathname;
	res.locals.locGet = function (name) {
		return str[name] || noLocText;
	};
	res.locals.langListString = config.get("langListRegExpStr");
	next();
};

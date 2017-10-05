var express = require('express');
var path = require('path');
var config = require('./config');
var log = require('./libs/log')(module);
var mongoose = require("./libs/mongoose");
var HttpError = require("./error").HttpError;
var AuthError = require("./error").AuthError;


var app = express();


app.engine("ejs", require("ejs-locals"));
app.set("views", __dirname + "/template");
app.set("view engine", "ejs");

app.use(express.favicon());
if(app.get("env") == "development"){
	app.use(express.logger("dev"));
}else{
	app.use(express.logger("default"));
}

app.use("/public", express.static("public"));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());


var MongoStore = require("connect-mongo")(express);
app.use(express.session({
	secret: config.get("session:secret"),
	key: config.get("session:key"),
	cookie: config.get("session:cookie"),
	store: new MongoStore({mongooseConnection: mongoose.connection})

}));



app.use(require("./lang"));
app.use(require("./middlaware/sendHttpError"));
app.use(require("./middlaware/loadUser"));

app.use(app.router);
require("./routes")(app);

app.use(function(err, req, res, next){
	if(typeof err === "number"){
		err = new HttpError(err);
	}

	if(err instanceof HttpError || err instanceof AuthError){
		res.sendHttpError(err);
	}else{
		if(app.get("env") == "development"){
			express.errorHandler()(err, req, res, next);
		}else{
			log.error(err);
			err = new HttpError(500);
			res.sendHttpError(err);
		}
	}
})


app.listen(process.env.PORT || config.get("port"), function(){
	log.info('Express server listening on port ' + (process.env.PORT || config.get("port")));
});

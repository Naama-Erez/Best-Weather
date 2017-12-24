/** external modules **/
var app = require('express')();
server = require('http').Server(app);
var index = function (req, res) {
	var options = {
		root: '../BestWeather/',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};
	res.sendFile('index.html', options);
};
var files = function (req, res) {
	var options = {
		root: '../BestWeather/',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};
	var fileName = req.params[0];
	res.sendFile(fileName, options);
};

app.get('/', index);
app.get('/:path/*', files);

server.listen(3000, function () {
	console.log('init server');
});



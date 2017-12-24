(function () {
	function BestWeatherController (BestWeatherService) {
		var that = this;
		this.weatherResults = [];
		this.gender = "MALE";
		BestWeatherService.getBestWeather(this.gender).then (function(data) {
			that.weatherResults = data;
		});
		this.changeGender = function () {
			that.weatherResults = [];
			BestWeatherService.getBestWeather(that.gender).then (function(data) {
				that.weatherResults = data;
			});
		}
	}

	angular.module('BestWeather')
		.controller('BestWeatherController', ['BestWeatherService',BestWeatherController]);
})();
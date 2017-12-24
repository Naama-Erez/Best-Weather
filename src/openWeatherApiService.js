(function() {
	function BestWeatherService ($http, $q) {
		const APP_ID ='&appid=a31757fbe9d2a2205208e4b0a3a68eac',
			API = 'http://api.openweathermap.org/data/2.5/box/city?bbox=',
			MIN_LON = -180,
			MAX_LON = 180,
			MIN_LAT = -90,
			MAX_LAT = 90,
			ZOOM = 10,
			IDEAL_WEATHER  = {
				MALE: 21,
				FEMALE: 22,
				HUMIDITY: 50
			},
			UPDATE_INTERVAL = 10,
			RESULT_COUNT = 7;

		var lastUpdate = null;
		var weatherResults = [];

		// gets all cities weather from the API
		function getAllWeather () {
			return $http.get(API + MIN_LON + ',' + MIN_LAT + ',' + MAX_LON + ',' + MAX_LAT + ',' + ZOOM + APP_ID);
		}

		/** set weather score for each city according to gender.
		 * score is calculated according to the absolute distance between ideal temp and humidity from city temp and humidity
		 */
		function getWeatherScores (data, temp) {
			_.each(data,function (city) {
				city.score = Math.abs(city.main.temp - temp) + Math.abs(city.main.humidity - IDEAL_WEATHER.HUMIDITY);
			});
			return _.sortBy(data, function(num){ return num.score; });
		}

		/**
		 * checks if more than 10 minutes has passed since last updated the weather from API
		 * @returns {boolean}
		 */
		function needToUpdate () {
			if (lastUpdate == null || !lastUpdate) {
				return true;
			} else {
				var now = new Date();
				var diff =(now.getTime() - lastUpdate.getTime()) / 1000 / 60;
				diff = Math.abs(Math.round(diff));
				if ( diff > UPDATE_INTERVAL) {
					return true;
				}
			}
			return false;
		}

		/**
		 * returns the default amount of cities with best weather according to selected gender
		 * @param gender
		 * @returns {*}
		 */
		this.getBestWeather  = function (gender) {
			return $q(function(resolve) {
				if (needToUpdate()) {
					getAllWeather()
						.then(function (response) {
							lastUpdate = new Date();
							weatherResults = response.data.list;
							var result = getWeatherScores(weatherResults,IDEAL_WEATHER[gender]);
							resolve (result.slice(0,RESULT_COUNT));
						});
				} else {
					var result = getWeatherScores(weatherResults,IDEAL_WEATHER[gender]);
					resolve (result.slice(0,RESULT_COUNT));
				}
			});

		};

	}

	angular.module('BestWeather')
		.service('BestWeatherService', ['$http', '$q', BestWeatherService]);
})();
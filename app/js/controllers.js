'use strict';

/* Controllers */


var ganttApp = angular.module('ganttApp', ['ganttChart', 'taskInputModule', 'dateTimeService']);



ganttApp.controller('scopeExampleController', ['$scope', function($scope) {
		$scope.status = "Not sent";
		$scope.sendMail = function(mail) {
		$scope.status = "Sent";
	};
}]);

ganttApp.directive('ngCity', function() {
	  return {
	    controller: function($scope) {}
	  };
	});

ganttApp.directive('ngSparkline', function() {
	var url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=imperial&cnt=7&callback=JSON_CALLBACK&q=";
	return {
		restrict: 'A',
		require: '^ngCity',
	    scope: {
	        ngCity: '@'
	    },
		template: '<div class="sparkline"><h4>Weather for {{ngCity}}</h4>Weather: <pre>{{ weather }}</pre></div>',
	    controller: ['$scope', '$http', function($scope, $http) {    	
	    	$scope.getTemp = function(city) {
	    		$http({
	    			method: 'JSONP',
	    			url: url + city
	    		}).success(function(data) {
	    			var weather = [];
	    			angular.forEach(data.list, function(value){
	    				weather.push(value);
	    			});
	    			$scope.weather = weather;
	    		});
	    	};
	    }],
	    link: function(scope, iElement, iAttrs, ctrl) {
	    	scope.getTemp(iAttrs.ngCity);
	    }
	};
});








ganttApp.controller('TaskListCtrl', ['$scope', '$http', 'dateTime', function($scope, $http, dateTime) {
	$scope.pos = 7;
	
	dateTime.SetStartDay("2014-03-01");
	
	$scope.test = {
	    pos: 6,
	    duration: 10
	    };
	
	
	$http.get('data/tasks.json').success(function(data) {
		$scope.tasks = data;
		console.log("scope.tasks " + $scope.tasks[0].name);
	});
	
}]);




'use strict';
// http://jsbin.com/laxacu/2/edit?html,js,output

// That's right! We can just require angular as if we were in node
var angular = require('angular');
var $ = require('jquery')(window);
global.jQuery = require("jquery");

var formstone = {
	core: require('formstone_core'),
	number: require('formstone_number')
};

(function($){
	
	$('#app').fadeIn(800);

	$("input[type=number]").number();

	$("#plus").click(function() {
		$(".row-distance").animate({
				scrollTop: $(document).height()
			}, 1200
		);
		return false;
	});

})(jQuery);

var app = angular.module('myApp', []);

app.controller('PaceCtrl', function ($scope) {

	var self;

  $scope.length = 5;
  $scope.distances = [
  	{length:3, selected: false},
  	{length:5, selected: true},
  	{length:10, selected: false},
  	{length:21.0975, selected: false},
  	{length:42.195, selected: false},
  ];

  $scope.blur = function() {
    console.log(this.time)
  };

  $scope.calcPace = function() {
    console.log($scope.length);
  };

  $scope.changeRadio = function(a,b,c){
  	$scope.length = parseFloat(jQuery('.form-distance:checked').val());
  	$scope.customDistance = false;
  };

  $scope.enableSubmit = function() {
  	$scope.customDistance = true;
  	// jQuery('.distance-top').fadeIn();

		angular.forEach($scope.distances, function(distance) {
			distance.selected = false;
    });
  };

  $scope.isEmpty = function(){
		return $scope.length == '' || $scope.length === null;
  }

  $scope.isSelected = function(){
		return ($scope.length == '' || $scope.length === null) && $scope.customDistance;
  }

});


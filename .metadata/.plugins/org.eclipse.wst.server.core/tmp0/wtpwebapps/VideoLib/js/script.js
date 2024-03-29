//	Angular app
var videoApp = angular.module('videoApp', ['ngRoute']);
var origin = window.location.origin;
if(origin.indexOf('localhost') > -1){
	origin += '/VideoLib';
}
videoApp.value('origin', origin);

//	View switching config
videoApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    
    when('/main', {
       templateUrl: 'main.htm',
       controller: 'mainController'
    }).
    
    when('/details', {
    	templateUrl: 'details.htm',
        controller: 'detailsController'
    }).
        
    otherwise({
       redirectTo: '/main' 
    });
 }]);

//	Main view controller
videoApp.controller('mainController', function($scope, $http, origin) {
	
	$scope.ratingBtns = [1,2,3,4,5];			
	$scope.getVideos = function(rating){
		
		$http({method: 'GET', url: origin + '/rest/VideoService/videos'})
		.success(function(response) {

			$scope.videos = response;
			if(rating == null){

				$scope.mainVideo = response[0];
				$scope.loadMainVideo(response[0]);
			}
		}).error(function(response) {
    	   
			console.log('error: ' + response.data);
		});
	}	
	$scope.getVideos();
	
	$scope.loadMainVideo = function(video){

		$scope.mainVideo = video;
		$scope.videoPath = 'video/' + video.filename;
		localStorage.videoId = video.id;
	}
	
	$scope.rate = function(newRating){
		
		$http({method: 'POST', 
		       url: origin + '/rest/VideoService/rate',
		       params: {id : $scope.mainVideo.id, rating : newRating}})
		.success(function(response) {

			$scope.getVideos(true);
			$scope.mainVideo.rating = response.rating;
		}).error(function(response) {
    	   
			console.log('error: ' + response.data);
		});
	}
	
	$scope.saveComment = function(){
		
		$http({method: 'POST', 
		       url: origin + '/rest/VideoService/comment',
		       params: {id : $scope.mainVideo.id, comment : $scope.comment},
		       headers: {'Content-Type': 'application/json; charset=UTF-8'}})
		.success(function(response) {

			confirmComment();

		}).error(function(response) {
    	   
			console.log('error: ' + response.data);
		});
	}
	
	function confirmComment(){
		
		var commentConf = document.getElementById('commentConf');
		commentConf.classList.toggle('hidden');
		commentConf.classList.toggle('displayed','w3-animate-zoom');
		setTimeout(function(){ commentConf.classList.toggle('hidden'); }, 3000);
	}
	
	$scope.disableCommentBtn = function(){

		return $scope.comment == undefined || $scope.comment == "";
	}
});

//	Video details controller
videoApp.controller('detailsController', function($scope, $http, origin) {
	
	var loaded = false;
	angular.element(document).ready(function (){
		
		document.getElementById("detailsPlayer").oncanplay = function() {
			loaded = true;
		};
	});
	
	$http({method: 'GET', 
	       url: origin + '/rest/VideoService/video',
	       params: {id : localStorage.videoId}})
	.success(function(response) {

		$scope.videoDetails = response;
		$scope.videoPath = 'video/' + response.video.filename;
		$scope.getVideoDuration();

	}).error(function(response) {
	   
		console.log('error: ' + response.data);
	});
	
	$scope.getVideoDuration = function (){
		
		if(loaded){
			
			$scope.vduration = getDurationstr(document.getElementById("detailsPlayer").duration);
			$scope.$apply();
		}else{
			setTimeout($scope.getVideoDuration, 10);					
		}
	}
});

function getDurationstr(durationsec) {

	var hours = Math.round((durationsec / (60*60)) % 24);
	var minutes = Math.round((durationsec / 60) % 60);
	var seconds = Math.round(durationsec % 60);

	var durationStr = "";
	if(hours > 0){
		durationStr += hours + "h ";
	}if(minutes > 0){
		durationStr += minutes + "m ";
	}if(seconds > 0){
		durationStr += seconds + "s";
	}
	return durationStr;
}
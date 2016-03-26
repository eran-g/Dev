var FEDExamUtils = {}

FEDExamUtils.arrIndexOfInsensitive = function(arr, searchElement, fromIndex) {
	
    return arr.map(function (value) {
    	
        return value.toLowerCase();
    }).indexOf(searchElement.toLowerCase(), fromIndex);
}

FEDExamUtils.flyToElement = function(flyer, flyingTo, artworkUrl) {
	
    var $func = $(this);
    var divider = 3;
    var flyerClone = $(flyer).clone();
    $(flyerClone).css({position: 'absolute', top: $(flyer).offset().top + "px", left: $(flyer).offset().left + "px", opacity: 1, 'z-index': 1000});
    $('body').append($(flyerClone));
    var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - ($(flyer).width()/divider)/2;
    var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - ($(flyer).height()/divider)/2;
     
    $(flyerClone).animate({
        opacity: 0.4,
        left: gotoX,
        top: gotoY,
        width: $(flyer).width()/divider,
        height: $(flyer).height()/divider
    }, 700,
    function () {
        $(flyingTo).fadeOut('fast', function () {
	        $(flyerClone).fadeOut('fast', function () {
	            $(flyerClone).remove();
	            $("img#img").attr("src", artworkUrl);
				$("img#img").show();
	        });
        });
    });
}

angular.element(document).ready(function (){
		
	// Sound Cloud Init
	SC.initialize({
	  client_id: 'd652006c469530a4a7d6184b18e16c81'
	});
	
	//	Recent Searches Local Storage
	if(localStorage.recentSearches == null){
		localStorage.recentSearches = "";
    }
});

var SoundCloudApp = angular.module('SoundCloud', ['ngRoute']);

SoundCloudApp.value('maxSearchRes', 6);
SoundCloudApp.value('maxRecentSearchRes', 5);

SoundCloudApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    
    when('/listView', {
       templateUrl: 'list.htm',
       controller: 'ListController'
    }).
    
    when('/tileView', {
    	templateUrl: 'tile.htm',
        controller: 'TileController'
    }).
        
    otherwise({
       redirectTo: localStorage.view != null? '/' + localStorage.view + 'View' : '/listView' 
    });
 }]);

SoundCloudApp.controller('ListController', function($scope) {
});

SoundCloudApp.controller('TileController', function($scope) {
});

SoundCloudApp.controller('SearchController', function($scope, $http, $sce, maxSearchRes, maxRecentSearchRes) {
	
	$scope.recentSearches = localStorage.recentSearches.split(",");
	$scope.search = {
       value: ""
    };
	$scope.selectedTrack = {uri:null, html:""};
	$scope.imgSrc = "";
	var recentSearchesArr = [];
	
	$scope.searchSoundhCloud = function(searchVal){
		
		if(searchVal != null){

			$scope.search.value = searchVal;
		}
		
		SC.get('/tracks', {
		  
		  q: searchVal != null? searchVal : $scope.search.value,
		  limit: maxSearchRes, 
		  linked_partitioning: 1
		}).then(function(tracks) {
		
			$scope.nextHref = tracks.next_href;

			populateSearchResults(tracks);
			
			if(searchVal == null){
				
				if($scope.search.value != "" && FEDExamUtils.arrIndexOfInsensitive(recentSearchesArr, $scope.search.value) == -1){
					
					localStorage.recentSearches = $scope.search.value + "," + localStorage.recentSearches;
				}
				recentSearchesArr = localStorage.recentSearches.split(",");
				while(recentSearchesArr.length > maxRecentSearchRes){
					recentSearchesArr.pop();
				}
				localStorage.recentSearches = recentSearchesArr.toString();
			
			
				$scope.recentSearches = recentSearchesArr;
			}
			$scope.$apply();
		});
	 };
	 
	$scope.noNextHref = function(){
		return $scope.nextHref == null;
	}
	
	$scope.getNext = function(){
		
		if($scope.nextHref != null){
			
			$http.get($scope.nextHref).success( function(response) {
				
				if(response.collection.length > 0){

					populateSearchResults(response);
					$scope.nextHref = response.next_href;
				}
			});
		}
	};
	
	$scope.play = function(){

		SC.oEmbed($scope.selectedTrack.uri, 
		{auto_play: true,
		 maxheight: '100%'}).then(function(oEmbed) {

			$scope.embedContainer = $sce.trustAsHtml(oEmbed.html);
			$scope.$apply();
		});
	}
	
	$scope.listItemClicked = function(artworkUrl, uri, id){
		
		$scope.embedContainer = $sce.trustAsHtml('');

		FEDExamUtils.flyToElement($("#" + id), $("img#img"), artworkUrl);
		$scope.imgStyle = {'visibility':'visible'};
		
		$scope.selectedTrack.uri = uri;
	}
	
	$scope.saveView = function(view){
		
		localStorage.view = view;
	}
	
	$scope.disableListBtn = function(){
		
		return localStorage.view == 'list';
	}
	
	$scope.disableTileBtn = function(){
		
		return localStorage.view == 'tile';
	}
	
	function populateSearchResults(response){
		
		$scope.searchResults = [];
		for(var i = 0; i < response.collection.length; i++){
			
			var track = response.collection[i];
			var res = {id: track.id,
					   title: track.title,
					   uri: track.uri,
					   artworkUrl: track.artwork_url != null? track.artwork_url : 'img/noImg.jpg'};
			$scope.searchResults.push(res);
		}
	}
});
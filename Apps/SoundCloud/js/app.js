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
				
				if($scope.search.value != "" && arrIndexOfInsensitive(recentSearchesArr, $scope.search.value) == -1){
					
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
	
	$scope.listItemClicked = function(res){

		$scope.embedContainer = $sce.trustAsHtml('');
		$scope.imgSrc = res.artworkUrl;
		$scope.selectedTrack.uri = res.uri;
		$scope.imgStyle = {'visibility':'visible'};
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

function arrIndexOfInsensitive(arr, searchElement, fromIndex) {
	
    return arr.map(function (value) {
    	
        return value.toLowerCase();
    }).indexOf(searchElement.toLowerCase(), fromIndex);
}
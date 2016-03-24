FEDExamApp.controller('SearchController', function($scope, $http, maxSearchRes, maxRecentSearchRes) {
	
	$scope.recentSearches = localStorage.recentSearches.split(",");
	$scope.search = {
       value: ""
    };
	$scope.selectedTrack = {uri:null, html:""};
	$scope.imgSrc = "";
	var recentSearchesArr = [];
	
	$scope.searchSoundhCloud = function(searchVal){
		
		if(searchVal != null){
			$("input#searchInput").val(searchVal);
		}
		
		SC.get('/tracks', {
		  
		  q: searchVal != null? searchVal : $scope.search.value,
		  limit: maxSearchRes, 
		  linked_partitioning: 1
		}).then(function(tracks) {
		
			$scope.nextHref = tracks.next_href;

			populateSearchResults(tracks);
			
			if($scope.search.value != "" && FEDExamUtils.arrIndexOfInsensitive(recentSearchesArr, $scope.search.value) == -1){
				
				localStorage.recentSearches = $scope.search.value + "," + localStorage.recentSearches;
			}
			recentSearchesArr = localStorage.recentSearches.split(",");
			while(recentSearchesArr.length > maxRecentSearchRes){
				recentSearchesArr.pop();
			}
			localStorage.recentSearches = recentSearchesArr.toString();
			$scope.recentSearches = recentSearchesArr;
			
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
	
	$scope.listItemClicked = function(artworkUrl, uri, id){
		
		$("#embedContainer").html("");

		FEDExamUtils.flyToElement($("#" + id), $("img#img"), artworkUrl);
		$("img#img").css("visibility","visible");
		
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
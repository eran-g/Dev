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

var FEDExamApp = angular.module("FEDExam", ['ngRoute']);

FEDExamApp.value("maxSearchRes", 6);
FEDExamApp.value("maxRecentSearchRes", 5);

FEDExamApp.config(['$routeProvider', function($routeProvider) {
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
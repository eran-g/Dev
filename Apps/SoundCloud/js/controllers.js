FEDExamApp.controller('ListController', function($scope) {
});

FEDExamApp.controller('TileController', function($scope) {
});

FEDExamApp.controller('ImgController', function($scope) {
	
	$scope.play = function(){

		SC.oEmbed($scope.selectedTrack.uri, 
		{auto_play: true,
		 maxheight: '60%'}).then(function(oEmbed) { 
			$("div#embedContainer").html(oEmbed.html);
		});
	}
});
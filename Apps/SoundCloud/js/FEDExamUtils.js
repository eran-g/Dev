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
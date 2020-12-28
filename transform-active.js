// Keeps track of the original positions of all the items
// And onclick functions
var orig_coordinates = [];
var orig_onclicks = {};
$(".item").each(function(index, item) {
	// Original coordinates
	var randomWidth = Math.floor(Math.random() * $(window).width() * .9);
	var randomHeight = Math.floor(Math.random() * $(window).height() * .9)
	orig_coordinates.push({
		top: Math.floor(Math.random() * $(window).height() * .9), 
		left: Math.floor(Math.random() * $(window).width() * .9)
	});
});

var isMobile = $(window).width() > 600;
var front_z_index = 0;

// To use in onclick functions to make sure it doesn't open on drag stop
function openLink(link, itemId) {
	if ($(itemId).hasClass('noclick')) {
		return
	}
	window.open(link,'_blank');
}

// Go through all of the items
$(".item").each(function(index, item) {
	if (isMobile) {
		// Changes the positions to hard-code the starting positions (so that everything isn't messed up with drag/drop)
		item.style = 'left:'+orig_coordinates[index].left+'px; top: '+orig_coordinates[index].top+'px; position: absolute;';
	}

	// Add lightbox
	$('#'+item.id).find('img').wrap(function() {
		return '<a href="'+ $(this).attr('src')+'" data-lightbox='+item.id+'></a>';
	});

	// When you click the menu button
	$(this).children('button').click(function(event) {
		front_z_index++;
		$('#'+item.id).css('z-index',front_z_index);
		if ($('#'+item.id).hasClass('noclick')) {
			return
		}
		item.classList.toggle('open');
	})
});

if (isMobile) {
	// Make the items draggable
	$('.item').draggable({ 
		cancel: true,
		start: function(event, ui) {
			front_z_index++;
			$(this).css('z-index', front_z_index);
			if ($(this).hasClass('linkitem')) {
				$(this).children('button').addClass('noclick');
			}
		},
		stop: function(event, ui) {
			var item = $(this);
			$(ui.helper).css('width','-webkit-fill-available')
			item.css('height','auto');
			if (item.hasClass('open') || item.hasClass('linkitem')) {
				item.addClass('noclick');
			}
			setTimeout(function() {
				item.removeClass('noclick');
			},
			500)
		}
	});
}

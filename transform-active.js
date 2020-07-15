// Keeps track of the original positions of all the items
var orig_coordinates = [];
$(".item").each(function(index, item) {
	var randomWidth = Math.floor(Math.random() * $(window).width() * .9);
	var randomHeight = Math.floor(Math.random() * $(window).height() * .9)
	orig_coordinates.push({
		top: Math.floor(Math.random() * $(window).height() * .9), 
		left: Math.floor(Math.random() * $(window).width() * .9)
	});
});

var front_z_index = 0;

function openLink(link, itemId) {
	if ($(itemId).hasClass('noclick')) {
		return
	}
	window.open(link,'_blank');
}

// Go through all of the items
$(".item").each(function(index, item) {
	// Changes the positions to hard-code the starting positions (so that everything isn't messed up with drag/drop)
	item.style = 'left:'+orig_coordinates[index].left+'px; top: '+orig_coordinates[index].top+'px; position: absolute;';
	var itemButton = $("#"+item.id+" button")

	// Add lightbox
	$('#'+item.id).find('img').wrap(function() {
		return '<a href="'+ $(this).attr('src')+'" data-lightbox='+item.id+'></a>';
	});

	// When you click the menu button
	itemButton.click(function(event) {
		front_z_index++;
		$('#'+item.id).css('z-index',front_z_index);
		if (item.classList.contains('noclick')) {
			return;
		}
		var imageQueryString = "#"+item.id+" img";
		item.classList.toggle('open');

		// Go through all of the image tags for that item
		$(imageQueryString).each(function(index, image) {
			// Adds class "open" to this image when the item is open
			// Removes class "open" when you close the item
			image.classList.toggle("open");

			// interval is in milliseconds, so this
			// runs the function every 15 ms
			var interval = 15;
			var maxWidth = 80;
			var minItemWidth = 15;
			var maxItemWidth = 35;
			// Width is set to the percent of the width of the grey box
			var imgWidth;
			var itemWidth;
			if (image.classList.contains("open")) {
				imgWidth = 0;
				itemWidth = minItemWidth;
			} else {
				imgWidth = maxWidth;
				itemWidth = maxItemWidth;
			}
			// Amount you need to change overall divided by the number of 
			// intervals
			var itemWidthRate = (maxItemWidth - minItemWidth) / (maxWidth)
			var id = setInterval(frame, interval);
			function frame() {
				// increase width if the item is opening
				if (image.classList.contains("open")) {
					if (imgWidth >= maxWidth) {
						clearInterval(id);
					} else {
						imgWidth += 1;
						itemWidth += itemWidthRate;
						image.style = "width:"+imgWidth+"%; padding-bottom: 10%";
						$('#'+item.id).css('width',itemWidth+'%')
					}
				} else {
					if (imgWidth <= 0) {
						image.style = "width:"+imgWidth+"%; padding-bottom: 0%;"
						clearInterval(id);
					} else {
						imgWidth -= 1;
						itemWidth -= itemWidthRate;
						image.style = "width:"+imgWidth+"%; padding-bottom: 10%;";
						$('#'+item.id).css('width',itemWidth+'%')
					}
				}
			}
		});
	})
});

// Make the items draggable
$('.item').draggable({ 
	cancel: true,
	start: function(event, ui) {
		front_z_index++;
		$(this).css('z-index', front_z_index);
		if ($(this)[0].classList.contains('open')
			|| $(this)[0].classList.contains('linkitem')) {
			$(this).addClass('noclick');
		}
	},
	stop: function(event, ui) {
		$(this).css('height','auto');
		if ($(this)[0].classList.contains('open')
			|| $(this)[0].classList.contains('linkitem')) {
			$(this).addClass('noclick');
		}
		var currentItem = $(this);
		setTimeout(function() {
			currentItem.removeClass('noclick')
		}, 30);
	}
});

(function function_name ($, window) {
	'use strict';

	$.fn.rangeSelector = function (options) {
		var range = $(this),
			rangeTrack = $('.range-track'),
			rangeSelection = $('.range-selection'),
			rangeSelectionWidth = rangeSelection.width(),
			time1 = range.find('.time1'),
			time2 = range.find('.time2'),
			handle1 = range.find('.range-handle:first'),
			handle2 = range.find('.range-handle:last'),
			isDragged = false,
			draggedRange = 0, 
			values = [0,0], 
			whichHandle;

		
		time1.html(values[0]);
		time2.html(values[1]);

		var mousemove = function (e) {
				
			if (isDragged) {
				getRange(e);
				if (whichHandle == 0 && values[1] < draggedRange) {
					values[0] = values[1];
					whichHandle = 1;
				} else if (whichHandle == 1 && values[0] > draggedRange){
					values[1] = values[0];
					whichHandle = 0;
				}
				values[whichHandle] = draggedRange;
				
				buildLayout();
			}
			
		};
		
		var mouseup = function () {
			isDragged = false;
		}
		
		var mousedown = function (e) {

			isDragged = true;
			getRange(e);
			
			var diff1 = Math.abs(draggedRange - values[0]);
			var diff2 = Math.abs(draggedRange - values[1]);
			whichHandle = diff1 < diff2 ? 0 : 1;
			
			
			values[whichHandle] = draggedRange;
			
			buildLayout();

			range.on({
				mousemove: mousemove
			})
		};

		var getRange = function (e) {
			var pos = e.pageX;
			var max = rangeTrack.offset().left + rangeTrack[0].offsetWidth;
			var min = rangeTrack.offset().left;
			
			draggedRange = Math.min(Math.max(min, pos), max) - rangeTrack.offset().left;
		};

		var buildLayout = function () {

			handle1[0].style.left = values[0] + 'px';
			handle2[0].style.left = values[1] + 'px';

			rangeSelection[0].style.left = values[0] + 'px';
			rangeSelection.width(values[1] - values[0]);

			//update badge
			var duration = 3*60 + 11;
			var inc = rangeTrack.width() / duration;

			time1.html( parseInt(values[0] / inc));
			time2.html( parseInt(values[1] / inc));

			var rangeValues = {
				t1: parseInt(values[0] / inc),
				t2: parseInt(values[1] / inc)
			}

			window.rangeValues = rangeValues;

		};

		range.on({
			mousedown: mousedown,
			mouseup: mouseup
		});
	}



})(jQuery, window);
	
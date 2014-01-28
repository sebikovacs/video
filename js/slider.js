$(document).ready(function () {
	var range = $('.range-holder'),
		rangeTrack = $('.range-track'),
		rangeSelection = $('.range-selection'),
		rangeSelectionWidth = rangeSelection.width(),
		handle1 = range.find('.range-handle:first'),
		handle2 = range.find('.range-handle:last'),
		isDragged = false,
		draggedRange = 0, 
		values = [0,0], 
		whichHandle;

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
	};

	range.on({
		mousedown: mousedown,
		mouseup: mouseup
	})
});
$(document).ready(function () {
	var vid = $('#demo')[0];
	var arr = [];

	window.increasePlaybackRate = function () {
		vid.playbackRate = vid.playbackRate + 0.1;
	}

	window.decreasePlaybackRate = function () {
		vid.playbackRate = vid.playbackRate - 0.1;
	}

	//start video at this certain point and play it until the end time
	//loop through it as many times as specified

	window.play = function () {
		vid.play();
	}

	

	var isDownLeft = false;
	var isDownRight = false;
	var times = [];

	$(vid).on('seeking', function () {
		
		var start = $('#start'),
			end = $('#end'),
			loop = $('#loop'),
			time = this.currentTime;
		
		if (isDownLeft) {
			start.val(time);
		} else if (isDownRight) {
			end.val(time);
		}
		
	})
	
	
	var updateStartPosition = function (e) {
		var leftCursor = $('.cursor-left');
		var rightCursor = $('.cursor-right');
		var range = $('.range');
		var pixelCount = vid.duration / $('.range').width();

		var left = (e.pageX - range.offset().left) - leftCursor.width();

		if ((isDownLeft && left >= 0) && (isDownLeft && left <= 400)) {
			var time = left * pixelCount;
			vid.currentTime = time;

			leftCursor.css('left', left + 'px');
			rightCursor.css('left', (left + 1) + 'px');
		}
	};

	var updateEndPosition = function (e) {

		var leftCursor = $('.cursor-left');
		var rightCursor = $('.cursor-right');
		var range = $('.range');
		var pixelCount = vid.duration / $('.range').width();

		var left = (e.pageX - range.offset().left) - leftCursor.width();

		if ((isDownRight && left >= 0) && (isDownRight && left <= 400)) {
			
			var time = left * pixelCount;
			vid.currentTime = time;

			rightCursor.css('left', (left + 2) + 'px');
		}
	}


	$(document).on('mousedown', '.cursor-inner-left', function () { isDownLeft = true;})
		.on('mouseup', '.cursor-inner-left', function () { isDownLeft = false;})
		.on('mousemove','.cursor-inner-left', updateStartPosition)
		.on('mouseup', function () { isDownLeft = false;})
		.on('mousemove', updateStartPosition);

	$(document).on('mousedown', '.cursor-inner-right', function () { isDownRight = true;})
		.on('mouseup', '.cursor-inner-right', function () { isDownRight = false;})
		.on('mousemove','.cursor-inner-right', updateEndPosition)
		.on('mouseup', function () { isDownRight = false;})
		.on('mousemove', updateEndPosition);
});
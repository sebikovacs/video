$(document).ready(function () {
	var vid = $('#demo')[0],
		isDownLeft = false;
		isDownRight = false,
		times = [],
		start = $('#start'),
		end = $('#end'),
		loop = $('#loop'),
		playbackRate = $('#playbackRate'),
		bundle = {
			start: 0,
			end: 0,
			loop: 0,
			playbackRate: 1
		};
	
	window.play = function () {
		vid.currentTime = bundle.start;
		vid.playbackRate = 0.8;
		vid.playbackRate = bundle.playbackRate;
		bundle.loop = loop.val() - 1;
		vid.play();
	}

	$(vid).on('seeking', function () {
		
		var time = this.currentTime;
			
		if (isDownLeft) {
			start.val(time);
			bundle.start = time; 
		} else if (isDownRight) {
			end.val(time);
			bundle.end = time;
		}
		
	});

	$(vid).on('timeupdate', function(e){
		if (!isDownLeft && !isDownRight && Math.floor(vid.currentTime) == Math.floor(bundle.end) && (bundle.loop > 0)) {
			
			vid.currentTime = bundle.start;
			
			bundle.loop = bundle.loop - 1;
		}
	});


	loop.on('keypress', function () {
		var $this = this;
		setTimeout(function() {
			bundle.loop = parseInt($($this).val());

		}, 100);
	});

	playbackRate.on('keypress', function () {
		var $this = this;
		setTimeout(function() {
			bundle.playbackRate = parseFloat($($this).val());
		}, 100);
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
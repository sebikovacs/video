$(document).ready(function () {
	var vid = $('#demo')[0],
		isDownLeft = false;
		isDownRight = false,
		times = [],
		start = $('#start'),
		end = $('#end'),
		loop = $('#loop'),
		playButton = $('#play'),
		pauseButton = $('#pause'),
		playbackRate = $('#playbackRate'),
		startIndicator = $('.time-start'),
		endIndicator = $('.time-end'),
		inputWrap = $('.input-wrap'),
		bundle = {
			start: 0,
			end: 0,
			loop: 0,
			playbackRate: 1
		},
		playing = false,
		paused = true,
		window.rangeValues = {
			t1: 0,
			t2: 0
		};
	
	startIndicator.html(bundle.start);
	endIndicator.html(bundle.end);

	playButton.on('click', function (e) {
		
		$(this).addClass('hide');
		pauseButton.removeClass('hide');

		e.preventDefault();

		vid.currentTime = window.rangeValues.t1;

		vid.playbackRate = bundle.playbackRate;
		
		bundle.loop = loop.val() - 1;
		
		vid.play();
	});

	pauseButton.on('click', function (e) {
		$(this).addClass('hide');
		playButton.removeClass('hide');

		e.preventDefault();
		
		vid.pause();
	})
	
	$(vid).on('pause', function () {
		paused = false;
	}).on('play', function () {
		playing = true;
	}).on('click', function() {
		if (!playing) {
			vid.play();
			playing = true;
		} else {
			vid.pause();
			playing = false;
		}
	}).on('mouseenter', function () {
		inputWrap.show();
	}).on('mouseleave', function () {
		inputWrap.hide();
	});

	inputWrap.on('mouseenter', function () {
		$(this).show();
	});

	$(vid).on('seeking', function () {
		
		var time = this.currentTime;
		if ((isDownLeft || isDownRight) && playing) {

			vid.pause();
			playing = false;

			pauseButton.addClass('hide');
			playButton.removeClass('hide');

		}

		if (isDownLeft) {
			start.val(time);
			bundle.start = time;
			startIndicator.html(parseInt(bundle.start));
		} else if (isDownRight) {
			end.val(time);
			bundle.end = time;
			endIndicator.html(parseInt(bundle.end));
		}
		
	});

	$(vid).on('timeupdate', function(e){
		
		if (Math.floor(vid.currentTime) == Math.floor(window.rangeValues.t2)) {
			
			vid.currentTime = window.rangeValues.t1;
			
			if (bundle.loop > 0){
				bundle.loop = bundle.loop - 1;
			} else {
				vid.pause();
			}
		}
	});

	var setLoopValue = function (direction, val, el) {
		
		if (!val) {
			el.val(1);
			val = 1;
		}

		if (direction > 0) {
			el.val(val + 1);
			setTimeout(function() {
				bundle.loop = parseInt(el.val());
			}, 100);
		} else if ((direction < 0) && (val > 1)) {
			el.val(val - 1);
			setTimeout(function() {
				bundle.loop = parseInt(el.val());
			}, 100);
		}
	}

	loop.on('keypress', function (e) {
		e.preventDefault();
	}).on('keydown', function (e) {
		var direction = 0,
			val = parseInt($(this).val()),
			$this = $(this);

		if (e.which == 38){
			direction = 1;
		} else if (direction = 40){
			direction = -1;
		}

		setLoopValue(direction, val, $this);

	}).on('mousewheel', function (e) {
		var val = parseInt($(this).val()),
			$this = $(this);

		setLoopValue(e.deltaY, val, $this);
	});



	playbackRate.on('keypress', function (e) {
		e.preventDefault();
	}).on('keydown', function (e) {
		var direction = 0,
			val = Math.round($this.val() * 100) / 100,
			$this = $(this);

		if (e.which == 38){
			direction = 1;
		} else if (direction = 40){
			direction = -1;
		}


	}).on('mousewheel', function (e) {
		
		var $this = $(this),
			val = Math.round($this.val() * 100) / 100;
			

		if ((e.deltaY > 0) && (val < 1)) {
			val = Math.round((val + 0.1) * 100) / 100;

			$this.val(val);
			
			setTimeout(function() {
				bundle.loop = val;
			}, 100);	
			
		} else if ((e.deltaY < 0) && (val > 0.1)) {
			val = Math.round((val - 0.1) * 100) / 100;
			
			$this.val(val);
			
			setTimeout(function() {
				bundle.loop = val;
			}, 100);
		}

		
		setTimeout(function() {
			bundle.playbackRate = parseFloat($this.val());
		}, 100);
	})
	
	// var updateStartPosition = function (e) {
	// 	var leftCursor = $('.cursor-left');
	// 	var rightCursor = $('.cursor-right');
	// 	var range = $('.range');
	// 	var pixelCount = vid.duration / $('.range').width();

	// 	var left = (e.pageX - range.offset().left) - leftCursor.width();

	// 	if ((isDownLeft && left >= 0) && (isDownLeft && left <= 400)) {
	// 		var time = left * pixelCount;
	// 		vid.currentTime = time;

	// 		leftCursor.css('left', left + 'px');
	// 		rightCursor.css('left', (left + 1) + 'px');
	// 	}
	// };

	// var updateEndPosition = function (e) {

	// 	var leftCursor = $('.cursor-left');
	// 	var rightCursor = $('.cursor-right');
	// 	var range = $('.range');
	// 	var pixelCount = vid.duration / $('.range').width();

	// 	var left = (e.pageX - range.offset().left) - leftCursor.width();

	// 	if ((isDownRight && left >= 0) && (isDownRight && left <= 400)) {
			
	// 		var time = left * pixelCount;
	// 		vid.currentTime = time;

	// 		rightCursor.css('left', (left + 2) + 'px');
	// 	}
	// }

	// $(document).on('mousedown', '.cursor-inner-left', function () { isDownLeft = true;})
	// 	.on('mouseup', '.cursor-inner-left', function () { isDownLeft = false;})
	// 	.on('mousemove','.cursor-inner-left', updateStartPosition)
	// 	.on('mouseup', function () { isDownLeft = false;})
	// 	.on('mousemove', updateStartPosition);

	// $(document).on('mousedown', '.cursor-inner-right', function () { isDownRight = true;})
	// 	.on('mouseup', '.cursor-inner-right', function () { isDownRight = false;})
	// 	.on('mousemove','.cursor-inner-right', updateEndPosition)
	// 	.on('mouseup', function () { isDownRight = false;})
	// 	.on('mousemove', updateEndPosition);
});
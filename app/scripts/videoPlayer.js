$(document).ready(function () {
	var vid = $('#demo')[0],
		isDownLeft = false;
		isDownRight = false,
		end = $('#end'),
		loop = $('.loop-val'),
		playButton = $('#play'),
		pauseButton = $('#pause'),
		playbackRate = $('.speed-val'),
		startIndicator = $('.time-start'),
		endIndicator = $('.time-end'),
		min = $('.min'),
		sec = $('.sec'),
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


	var updateTime = function () {
		var ss = parseInt(vid.currentTime);
		var mm = 0;

		ss = ss < 10 ? '0' + ss : ss;

		sec.html(ss);

	};

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
			$('.feedback-loop span.loops').html(bundle.loop)
			vid.currentTime = window.rangeValues.t1;
			
			if (bundle.loop > 0){
				bundle.loop = bundle.loop - 1;
			} else {
				vid.pause();
			}
		}

		if (playing) {
			updateTime();
		}
	});

	var setLoopValue = function (direction, val, el) {
		
		if (!val) {
			el.html(1);
			val = 1;
		}

		if (direction > 0) {
			el.html(val + 1);
			setTimeout(function() {
				bundle.loop = parseInt(el.html());
			}, 100);
		} else if ((direction < 0) && (val > 1)) {
			el.html(val - 1);
			setTimeout(function() {
				bundle.loop = parseInt(el.html());
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

		var val = parseInt($(this).html()),
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
			val = Math.round($this.html()) / 100;
			

		if ((e.deltaY > 0) && (val < 1)) {
			val = Math.round((val + 0.1) * 100) / 100;

      $this.html(val * 100);
			
			setTimeout(function() {
				bundle.loop = val;
			}, 100);	
			
		} else if ((e.deltaY < 0) && (val > 0.1)) {


			val = Math.round((val - 0.1) * 100) / 100;

			$this.html(val);
			
			setTimeout(function() {
				bundle.loop = val;
			}, 100);
		}

		
		setTimeout(function() {
			bundle.playbackRate = parseFloat($this.val());
		}, 100);
	});
});
$(document).ready(function () {
	var el = document.getElementById('droparea'),
		progress = $('.progress'),
		progressBar = progress.find('.progress-bar'),
		droparea = $('.droparea-wrap'),
		dropareaBtn = droparea.find('.btn'),
    videoWrap = document.getElementsByClassName('video')[0];

	var updateProgress = function (evt) {
		if (evt.lengthComputable) {

			progress.show();

			var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
			
			// Increase the progress bar length.
			if (percentLoaded < 100) {
				progressBar[0].style.width = percentLoaded + '%';
				//progress.textContent = percentLoaded + '%';
			}
		}
	}

  el.ondragover = function () {
    this.className = 'hover';
    return false;
  };

	el.ondragout = function () {
		this.className = ''; 
		return false; 	
	};

	el.ondrop = function (evt) {
		this.className = '';
		evt.preventDefault();
		
		//console.log(e.dataTransfer.files)

		var file = evt.dataTransfer.files[0];

		var reader = new FileReader();
		
		reader.onprogress = updateProgress;

    el.style.display = 'none';
		reader.onload = function (e) {
			
			progressBar[0].style.width = '100%';

			setTimeout(function() {
				progress[0].style.display = 'none';
				
        $('#demo').attr('src', e.target.result).on('canplay', function () {
          $('.video').width(this.videoWidth).height(this.videoHeight).css('display','block');
          $('.video-controls').css('display', 'block');
        });
        
			}, 1000);
			
		};

		reader.readAsDataURL(file);
		
	};

	dropareaBtn.on('click', function (e) {
		e.preventDefault();
		el.style.display = 'block';
	});
	
	var tests = {
		file: window.File ? true : false,
		fileReader: window.FileReader ? true : false,
		fileList: window.FileList ? true : false,
		blob: window.Blob ? true : false
	}

  if ($('#demo').attr('src') != '') {
    $('.video').css('display','block');
    $('#demo').on('canplay', function () {
      $('.video')
        .width(this.videoWidth)
        .height(this.videoHeight);
    });
    $('.video-controls').css('display', 'block');
  }

});
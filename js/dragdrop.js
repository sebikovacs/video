$(document).ready(function () {
	var el = document.getElementById('droparea'),
		progress = $('.progress'),
		progressBar = progress.find('.progress-bar'),
		droparea = $('.droparea-wrap'),
		dropareaBtn = droparea.find('.btn');

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

		reader.onload = function (e) {
			
			progressBar[0].style.width = '100%';

			setTimeout(function() {
				progress[0].style.display = 'none';
				el.style.display = 'none';
				$('#demo').attr('src', e.target.result);
				
			}, 1000);
			
		}
		
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
	
});
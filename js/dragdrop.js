$(document).ready(function () {
	var el = document.getElementById('droparea');
	el.ondragover = function () { 
		this.className = 'hover'; 
		return false; 
	};
	el.ondragout = function () {
		this.className = ''; 
		return false; 	
	}

	el.ondrop = function (e) {
		this.className = '';
		e.preventDefault();
		console.log(e.dataTransfer.files)
	}

	var tests = {
		file: window.File ? true : false,
		fileReader: window.FileReader ? true : false,
		fileList: window.FileList ? true : false,
		blob: window.Blob ? true : false
	}
	
});
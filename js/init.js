var canvasElement;
var canvas;
var motionBlur = false;

$(document).ready(function(){
	console.log("init.js loaded");
	canvasElement = document.getElementById("canvas");
	canvas = canvasElement.getContext("2d");

	// Update canvas size upon resize
	$(window).resize(function(){
		canvasElement.width = window.innerWidth;
		canvasElement.height = window.innerHeight;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	_onLoad();
});

var _timeSinceLastRender;
function _renderFrame(timestamp) {
	var deltatime = timestamp - _timeSinceLastRender;
	_timeSinceLastRender = timestamp;

	if (motionBlur) {
		canvas.fillStyle = '#fff';
		canvas.globalAlpha = 0.2;
		canvas.fillRect(0, 0, canvas.width, canvas.height);
		canvas.globalAlpha = 1;
	} else {
		canvas.clearRect(0, 0, canvas.width, canvas.height);
	}
	update(deltatime);

	window.requestAnimationFrame(_renderFrame);
}

function _onLoad(){
	$(window).resize();
	start();
	_timeSinceLastRender = performance.now();
	window.requestAnimationFrame(_renderFrame);
}
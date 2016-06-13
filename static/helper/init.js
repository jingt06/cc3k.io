define(function(require, exports, module) {
	var context;
	var canvas;
	var width;
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext("2d");
	ScreenWidth = document.body.clientWidth;
	ScreenHeight = document.body.clientHeight;
	width = (ScreenWidth > ScreenHeight ? ScreenHeight : ScreenWidth); // we need a square screen
	canvas.width = width;
	canvas.height = width;
	exports.width = width;
	exports.cellWidth = width / 7;
	exports.canvas = canvas;
	exports.context = context;
});
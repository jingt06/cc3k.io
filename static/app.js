requirejs(["helper/init.js"], function(init) {
	init.socketInit();
	screenWidth = init.width;
	console.log(init.map);
	console.log(init.clientId);
});


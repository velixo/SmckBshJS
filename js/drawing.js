function drawRect(x, y, width, height, color, opacity) {
	canvas.globalAlpha = evalArg(opacity, 1);
	canvas.fillStyle = evalArg(color, "#000");
	canvas.fillRect(x, y, width, height);
	canvas.globalAlpha = 1;
}

function drawCircle(x, y, radius, color, opacity) {
	canvas.globalAlpha = evalArg(opacity, 1);
	canvas.fillStyle = evalArg(color, "#0d0");
	canvas.beginPath();
	canvas.arc(x, y, radius, 0, 2*Math.PI);
	canvas.fill();
	canvas.globalAlpha = 1;
}

function drawText(x, y, text, color) {
	canvas.font="40px Sans-Serif";
	canvas.fillStyle = evalArg(color, "#000");
	canvas.fillText(text, x, y);
}

function drawHit(player, dir, progress, hitrect) {
	if (progress < 1) {
		var animX;
		var animY;
		if (dir === 'u') {
			animX = player.x - player.width;
			animY = player.y - player.height * 3;
		} else if (dir === 'r') {
			animX = player.x + player.width;
			animY = player.y - player.height;
		} else if (dir === 'd') {
			animX = player.x - player.width;
			animY = player.y + player.height;
		} else if (dir === 'l') {
			animX = player.x - player.width * 3;
			animY = player.y - player.height;
		} else {
			console.log("Direction " + dir + " cannot be animated");
			return;
		}
		canvas.globalAlpha = 1 - progress;
		canvas.fillStyle = "#000";
		canvas.fillRect(animX, animY, player.width * 3, player.height * 3);
		canvas.globalAlpha = 1;
	}
}
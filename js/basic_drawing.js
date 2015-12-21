function drawRect(x, y, width, height, color) {
	canvas.fillStyle = evalArg(color, "#000");
	canvas.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
	canvas.fillStyle = evalArg(color, "#0d0");
	canvas.beginPath();
	canvas.arc(x, y, radius, 0, 2*Math.PI);
	canvas.fill();
}

function drawText(x, y, text) {
	canvas.font="40px Georgia";
	canvas.fillStyle = "#000";
	canvas.fillText(text, x, y);
}

function drawHit(player, dir, progress) {
	if (progress < 1) {
		var animX;
		var animY;
		if (dir === 'u') {
			animX = player.x;
			animY = player.y - player.height;
		} else if (dir === 'r') {
			animX = player.x + player.width;
			animY = player.y;
		} else if (dir === 'd') {
			animX = player.x;
			animY = player.y + player.height;
		} else if (dir === 'l') {
			animX = player.x - player.width;
			animY = player.y;
		} else {
			console.log("Direction " + dir + " cannot be animated");
			return;
		}
		canvas.globalAlpha = 1 - progress;
		canvas.fillStyle = "#000";
		canvas.fillRect(animX, animY, player.width, player.height);
		canvas.globalAlpha = 1;
	}
}
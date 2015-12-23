/** This file is the main container of game logic.*/

var world;
var floor;
var lwall;
var rwall;
var platform1;
var platform2;
var platform3;

var blobs;
var player;
var effectsManager;
var playerName;

var timeToBlobSpawn;
var maxBlobs = 25;

/** Called when page is loaded*/
function start() {
	console.log("game.start");
	playerName = prompt("Enter your name:");
	world = new World();
	loadLevel1();
	effectsManager = new EffectManager();
	player = new Player(canvas.width / 2, 200, 40, effectsManager, playerName);
	blobs = [];
	timeToBlobSpawn = performance.now();
}

/** Called every new frame
 * @param {number} deltatime The time since the last frame was rendered, in milliseconds.
 */
function update(deltatime) {
	world.update(deltatime);
	player.update(deltatime);
	world.draw();
	player.draw();
	effectsManager.drawEffects();

	if (performance.now() > timeToBlobSpawn && blobs.length < maxBlobs) {
		timeToBlobSpawn = performance.now() + 2500;
		blobs.push(new Blob(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height), 20));
	}
}

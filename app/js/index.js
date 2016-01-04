$(document).ready(function() {
	newGame(0x99, 0xf7, 94);

	$(window).resize(resizeUnplacedTile);
	resizeUnplacedTile();

	$('#unplaced-tiles').on('click', '.unplaced-tile', unplacedTileClick);
});

function newGame(minColor, maxColor, numTiles) {
	/* Add unplaced tiles */
	var incr = Math.round((maxColor - minColor) / (numTiles - 1));

	var colors = [];

	for(var i = 0; i < (numTiles - 1); i++) {
		colors[i] = minColor + incr*i;
	}
	
	colors[i] = maxColor;

	shuffle(colors);

	for(var i = 0; i < colors.length; i++) {
		addUnplacedTile(colors[i]);
	}

	/* Add empty placed tiles */
	//$('#placed-tiles').append('<hr class="placed-tile-divider">');

	for(var i = 0; i < numTiles; i++) {
		addEmptyPlacedTile(i+1);
	}

	$('#placed-tiles').sortable({
		handle: '.drag-handle'
	});
	$('#placed-tiles').disableSelection();
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	/* While there remain elements to shuffle */
	while (0 !== currentIndex) {
		/* Pick a remaining element */
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		/* And swap it with the current element. */
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function addUnplacedTile(color) {
	var colorStr = '#' + color.toString(16) + color.toString(16) + color.toString(16);

	var $unplacedTile = $('<div class="unplaced-tile"></div>');
	$unplacedTile.css("background-color", colorStr);

	$('#unplaced-tiles').append($unplacedTile);
}

function addEmptyPlacedTile(num) {
	$('#placed-tiles').append('<div class="placed-tile"><div class="drag-handle"></div></div>');
	//$('#placed-tiles').append('<div class="placed-tile"><span class="placed-tile-number">' + zeroPad(num, 2) + '</span></div>');
	//$('#placed-tiles').append('<hr class="placed-tile-divider">');
}

function zeroPad(n, p) {
	var pad = new Array(1 + p).join('0');
	return (pad + n).slice(-pad.length);
}

function resizeUnplacedTile() {
	var handWidth = $('.unplaced-tiles').width();
	var numTiles = $('.unplaced-tile').length;
	var tilesPerRow = 5;

	while(!willFitInHand(handWidth, numTiles, tilesPerRow)) {
		tilesPerRow++;
	}

	// var debug = document.querySelector('#debugText');
	// debug.innerHTML = window.innerWidth + " " + window.innerHeight + " " + tilesPerRow + " " + game.camera.width + " " + game.camera.height;

	var tileSize = handWidth / tilesPerRow;

	var $tiles = $('.unplaced-tile');
	$tiles.css('width', 'calc('+tileSize+'px - 1%)');
	$tiles.css('height', $tiles.width());
}

var percentOfHeight = 0.3;

function willFitInHand(handWidth, numTiles, tilesPerRow) {
	var tileSize = handWidth / tilesPerRow;
	var handHeight = Math.ceil(numTiles / tilesPerRow) * tileSize;
	var maxHandHeight = percentOfHeight * window.innerHeight;

	return handHeight <= maxHandHeight;
}

var nextTilePos = 0;

function unplacedTileClick() {
	var color =  $(this).css('background-color');
	$(this).remove();

	var placedTile = $($('.placed-tile')[nextTilePos]);
	placedTile.css('background-color', color);
	nextTilePos++;
}
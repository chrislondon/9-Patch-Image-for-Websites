// Attach NinePatchWindowLoad to the window load
if (window.attachEvent) {
	window.attachEvent('onload', NinePatchWindowLoad);
} else if (window.addEventListener) {
	window.addEventListener('load', NinePatchWindowLoad, false);
} else {
	document.addEventListener('load', NinePatchWindowLoad, false);
}

// Run through all divs onload and initiate NinePatch objects
function NinePatchWindowLoad() {
	var elms = document.getElementsByTagName('div');
	for (var i in elms) {
		if (NinePatchGetStyle(elms[i], 'background-image').match(/\.9\.(png|gif)/i)) {
			new NinePatch(elms[i]);
		}
	}
}

// Cross browser function to get computed style.
function NinePatchGetStyle(element, style) {
	if (window.getComputedStyle) {
		var computedStyle = window.getComputedStyle(element, "");
		if (computedStyle == null) return "";
		return computedStyle.getPropertyValue(style);
	} else if (element.currentStyle) {
		return element.currentStyle[style];
	} else {
		return "";
	}
}

/**
 * 9patch constructer.  Sets up cached data and runs initial draw.
 * 
 * @constructor
 */
function NinePatch(div) {
	this.div = div;
	
	// Load 9patch from background-image
	this.bgImage = new Image();
	this.bgImage.src = NinePatchGetStyle(this.div, 'background-image').replace(/"/g,"").replace(/url\(|\)$/ig, "");
	this.originalBgColor = NinePatchGetStyle(this.div, 'background-color');
	
	this.div.style.background = 'none';
	this.div.style.backgroundRepeat = 'no-repeat';
	
	// Create a temporary canvas to get the 9Patch index data.
	var tempCtx, tempCanvas;
	tempCanvas = document.createElement('canvas');
	tempCtx = tempCanvas.getContext('2d');
	tempCtx.drawImage(this.bgImage, 0, 0);

	// Loop over each  horizontal pixel and get piece
	var data = tempCtx.getImageData(0, 0, this.bgImage.width, 1).data;
	
	// Use the upper-left corner to get staticColor, use the upper-right corner
	// to get the repeatColor.
	var tempLength = data.length - 4;
	var staticColor = data[0] + ',' + data[1] + ',' + data[2] + ',' + data[3];
	var repeatColor = data[tempLength] + ',' + data[tempLength + 1] + ',' + 
			data[tempLength + 2] + ',' + data[tempLength + 3];
	
	this.horizontalPieces = this.getPieces(data, staticColor, repeatColor);
	
	// Loop over each  horizontal pixel and get piece
	data = tempCtx.getImageData(0, 0, 1, this.bgImage.height).data;
	this.verticalPieces = this.getPieces(data, staticColor, repeatColor);

	// use this.horizontalPieces and this.verticalPieces to generate image
	
	this.draw();
	var _this = this;
	this.div.onresize = function(){_this.draw()};
}

// Stores the HTMLDivElement that's using the 9patch image
NinePatch.prototype.div = null;
// Stores the original background css color to use later
NinePatch.prototype.originalBG = null;
// Stores the pieces used to generate the horizontal layout
NinePatch.prototype.horizontalPieces = null;
// Stores the pieces used to generate the vertical layout
NinePatch.prototype.verticalPieces = null;
// Stores the 9patch image
NinePatch.prototype.bgImage = null;

// Gets the horizontal|vertical pieces based on image data
NinePatch.prototype.getPieces = function(data, staticColor, repeatColor) {
	var tempDS, tempPosition, tempWidth, tempColor, tempType;
	var tempArray = new Array();

	tempColor = data[4] + ',' + data[5] + ',' + data[6] + ',' + data[7];
	tempDS = (tempColor == staticColor ? 's' : (tempColor == repeatColor ? 'r' : 'd'));
	tempPosition = 1;

	for (var i = 4, n = data.length - 4; i < n; i += 4) {
		tempColor = data[i] + ',' + data[i + 1] + ',' + data[i + 2] + ',' + data[i + 3];
		tempType = (tempColor == staticColor ? 's' : (tempColor == repeatColor ? 'r' : 'd'));
		if (tempDS != tempType) {
			// box changed colors
			tempWidth = (i / 4) - tempPosition;
			tempArray.push(new Array(tempDS, tempPosition, tempWidth));

			tempDS = tempType;
			tempPosition = i / 4;
			tempWidth = 1
		}
	}

	// push end
	tempWidth = (i / 4) - tempPosition;
	tempArray.push(new Array(tempDS, tempPosition, tempWidth));

	return tempArray;
}

// Function to draw the background for the given element size.
NinePatch.prototype.draw = function() {
	var dCtx, dCanvas, dWidth, dHeight;
	dWidth = this.div.offsetWidth;
	dHeight = this.div.offsetHeight;
	dCanvas = document.createElement('canvas');
	dCtx = dCanvas.getContext('2d');
	
	dCanvas.width = dWidth;
	dCanvas.height = dHeight;
	
	var fillWidth, fillHeight;

	// Determine the width for the static and dynamic pieces
	var tempStaticWidth = 0;
	var tempDynamicCount = 0;
	
	for (var i = 0, n = this.horizontalPieces.length; i < n; i++) {
		if (this.horizontalPieces[i][0] == 's') {
			tempStaticWidth += this.horizontalPieces[i][2];
		} else {
			tempDynamicCount++;
		}
	}

	fillWidth = (dWidth - tempStaticWidth) / tempDynamicCount;

	// Determine the height for the static and dynamic pieces
	var tempStaticHeight = 0;
	tempDynamicCount = 0;
	for (var i = 0, n = this.verticalPieces.length; i < n; i++) {
		if (this.verticalPieces[i][0] == 's') {
			tempStaticHeight += this.verticalPieces[i][2];
		} else {
			tempDynamicCount++;
		}
	}

	fillHeight = (dHeight - tempStaticHeight) / tempDynamicCount;

	// Loop through each of the vertical/horizontal pieces and draw on
	// the canvas
	for (var i = 0, m = this.verticalPieces.length; i < m; i++) {
		for (var j = 0, n = this.horizontalPieces.length; j < n; j++) {
			var tempFillWidth, tempFillHeight;

			tempFillWidth = (this.horizontalPieces[j][0] == 'd') ? 
					fillWidth : this.horizontalPieces[j][2];
			tempFillHeight = (this.verticalPieces[i][0] == 'd') ? 
					fillHeight : this.verticalPieces[i][2];

			// Stretching :
			if (this.verticalPieces[i][0] != 'r') {
				// Stretching is the same function for the static squares
				// the only difference is the widths/heights are the same.
				dCtx.drawImage(
						
						this.bgImage,
				    this.horizontalPieces[j][1], this.verticalPieces[i][1],
				    this.horizontalPieces[j][2], this.verticalPieces[i][2],
				    0, 						0,
				    tempFillWidth, tempFillHeight);
			} else {
				var tempCanvas    = document.createElement('canvas');
				tempCanvas.width  = this.horizontalPieces[j][2];
				tempCanvas.height = this.verticalPieces[i][2];
				
				var tempCtx = tempCanvas.getContext('2d');
				tempCtx.drawImage(this.bgImage,
						this.horizontalPieces[j][1], this.verticalPieces[i][1],
						this.horizontalPieces[j][2], this.verticalPieces[i][2],
						0, 						0,
						this.horizontalPieces[j][2], this.verticalPieces[i][2]);
				
				var tempPattern = dCtx.createPattern(tempCanvas, 'repeat');
				dCtx.fillStyle = tempPattern;
				dCtx.fillRect(
						0, 			   0,
						tempFillWidth, tempFillHeight);
			}

			// Shift to next x position
			dCtx.translate(tempFillWidth, 0);
		}

		// shift back to 0 x and down to the next line
		dCtx.translate(-dWidth, (this.verticalPieces[i][0] == 's' ? this.verticalPieces[i][2] : fillHeight));
	}
	
	// store the canvas as the div's background
	var url = dCanvas.toDataURL("image/png");
	this.div.style.background = this.originalBgColor+" url("+url+")";
}
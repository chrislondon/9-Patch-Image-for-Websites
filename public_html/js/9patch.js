$(window).load(function() {
	$('div').each(function(){
		if ($(this).css('background-image').match(/\.9\.(png|gif)/i)) {
			var oImgSrc = $(this).css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, "");
			
			var originalBG = $(this).css("background-color");
			$(this).css('background', 'none');
			
			// o is origin
			var oImg = new Image();
			oImg.src = oImgSrc;
			oWidth = oImg.width;
			oHeight = oImg.height;

			// d is destination
			var dCtx, dCanvas, dWidth, dHeight;
			dWidth = $(this).outerWidth();
			dHeight = $(this).outerHeight();
			dCanvas = document.createElement('canvas');
			dCtx = dCanvas.getContext('2d');

			dCtx.drawImage(oImg, 0, 0);

			var horizontalPieces = new Array();
			var verticalPieces = new Array();
			// each piece contains d|s, position, width

			// Loop over each  horizontal pixel and get piece
			data = dCtx.getImageData(0, 0, oWidth, 1).data;
			horizontalPieces = getPieces(data);

			// Loop over each  horizontal pixel and get piece
			data = dCtx.getImageData(0, 0, 1, oHeight).data;
			verticalPieces = getPieces(data);

			// use horizontalPieces and verticalPieces to generate image
			dCanvas.width = dWidth;
			dCanvas.height = dHeight;

			var fillWidth, fillHeight;

			// Determine the width for the static and dynamic pieces
			var tempStaticWidth = 0;
			var tempDynamicCount = 0;
			for (var i = 0, n = horizontalPieces.length; i < n; i++) {
				if (horizontalPieces[i][0] == 's') {
					tempStaticWidth += horizontalPieces[i][2];
				} else {
					tempDynamicCount++;
				}
			}

			fillWidth = (dWidth - tempStaticWidth) / tempDynamicCount;

			// Determine the height for the static and dynamic pieces
			var tempStaticHeight = 0;
			var tempDynamicCount = 0;
			for (var i = 0, n = verticalPieces.length; i < n; i++) {
				if (verticalPieces[i][0] == 's') {
					tempStaticHeight += verticalPieces[i][2];
				} else {
					tempDynamicCount++;
				}
			}

			fillHeight = (dHeight - tempStaticHeight) / tempDynamicCount;

			// Loop through each of the vertical/horizontal pieces and draw on
			// the canvas
			for (var i = 0, m = verticalPieces.length; i < m; i++) {
				for (var j = 0, n = horizontalPieces.length; j < n; j++) {
					var tempFillWidth, tempFillHeight;

					tempFillWidth = (horizontalPieces[j][0] == 'd') ? 
							fillWidth : horizontalPieces[j][2];
					tempFillHeight = (verticalPieces[i][0] == 'd') ? 
							fillHeight : verticalPieces[i][2];

					// Stretching :
					dCtx.drawImage(oImg,
					    horizontalPieces[j][1], verticalPieces[i][1],
					    horizontalPieces[j][2], verticalPieces[i][2],
					    0, 						0,
					    tempFillWidth, tempFillHeight);

					// Shift to next x position
					dCtx.translate(tempFillWidth, 0);


					// Use this part for repeating:
					/* var tempCanvas    = document.createElement('canvas');
					 * tempCanvas.width  = horizontalPieces[j][2];
					 * tempCanvas.height = verticalPieces[i][2];
					 * 
					 * var tempCtx = tempCanvas.getContext('2d');
					 * tempCtx.drawImage(oImg,
					 * 		horizontalPieces[j][1], verticalPieces[i][1],
					 * 		horizontalPieces[j][2], verticalPieces[i][2],
					 * 		0, 						0,
					 *		horizontalPieces[j][2], verticalPieces[i][2]);
					 * 
					 * var tempPattern = dCtx.createPattern(tempCanvas, 'repeat');
					 * dCtx.fillStyle = tempPattern;
					 * dCtx.fillRect(
					 * 		0, 			   0,
					 * 		tempFillWidth, tempFillHeight);
					 * 
					 * dCtx.translate(tempFillWidth, 0);
					 */
				}

				// shift back to 0 x and down to the next line
				dCtx.translate(-dWidth, (verticalPieces[i][0] == 's' ? verticalPieces[i][2] : fillHeight));
			}
			
			// store the canvas as the div's background
			var url = dCanvas.toDataURL();
			$(this).css("background", originalBG+" url("+url+")");
			$(this).css("background-repeat", "no-repeat");
		}
	});

	return;
});

function getPieces(dataArray) {
	var tempDS, tempPosition, tempWidth;
	var tempArray = new Array();

	tempDS = (data[4] != 0) ? 's' : 'd';
	tempPosition = 1;

	for (var i = 4, n = data.length - 4; i < n; i += 4) {
		if (tempDS != ((data[i] != 0) ? 's' : 'd')) {
			// box changed colors
			tempWidth = (i / 4) - tempPosition;
			tempArray.push(new Array(tempDS, tempPosition, tempWidth));

			tempDS = (data[i] != 0) ? 's' : 'd';
			tempPosition = i / 4;
			tempWidth = 1
		}
	}

	// push end
	tempWidth = (i / 4) - tempPosition;
	tempArray.push(new Array(tempDS, tempPosition, tempWidth));

	return tempArray;
}
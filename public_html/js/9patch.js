$(window).load(function() {
	$('div').each(function(){
		if ($(this).css('background-image').match(/\.9\.png/)) {
			var imgSrc = $(this).css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, "");

			$(this).css('background', 'none');
			
			var ctx, canvas, img;
			img = new Image();
			img.src = imgSrc;
			
			canvas = document.createElement('canvas');
			ctx = canvas.getContext('2d');
			
			ctx.drawImage(img, 0, 0);

			// get sx, sWidth
			var sx, swidth;

			data = ctx.getImageData(0, 0, img.width, 1).data;
			
			// Loop over each pixel and invert the color.
			for (var i = 0, n = data.length; i < n; i += 4) {
				if (sx == undefined && data[i] == 0) {
					sx = i / 4;
				} else if (sx != undefined && swidth == undefined && data[i] != 0) {
					swidth = (i / 4) - sx;
					break;
				}
			}		
			// get sy, sHeight
			var sy, sheight;

			data = ctx.getImageData(0, 0, 1, img.height).data;
			
			// Loop over each pixel and invert the color.
			for (var i = 0, n = data.length; i < n; i += 4) {
				if (sy == undefined && data[i] == 0) {
					sy = i / 4;
				} else if (sy != undefined && sheight == undefined && data[i] != 0) {
					sheight = (i / 4) - sy;
					break;
				}
			}
			
		
			
			canvas.width = $(this).width();
			canvas.height = $(this).height();
			
			// TODO Check math on all of these things
			
			/*
			 * Repeated Patterns
			 * 
			 * We need to create a separate canvas for each repeated section.
			 */
			
			var topCenterCanvas = document.createElement('canvas');
			topCenterCanvas.width = swidth;
			topCenterCanvas.height = sy-1;
			var topCenterCtx = topCenterCanvas.getContext('2d');
			topCenterCtx.drawImage(img,
					sx,
					1,
					swidth,
					sy-1,
					0,
					0,
					swidth,
					sy-1);
			
			var pattern = ctx.createPattern(topCenterCanvas, 'repeat');
			ctx.fillStyle = pattern;
			ctx.fillRect(
				sx-1,
				0,
				$(this).width()-(sx-1)-(img.width-sx-swidth-1),
				sy-1
			);
			
			// Middle left
			var middleLeftCanvas = document.createElement('canvas');
			middleLeftCanvas.width = sx-1;
			middleLeftCanvas.height = sheight;
			var middleLeftCtx = middleLeftCanvas.getContext('2d');
			middleLeftCtx.drawImage(img,
					1,
					sy,
					sx-1,
					sheight,
					0,
					0,
					sx-1,
					sheight);
			
			var pattern = ctx.createPattern(middleLeftCanvas, 'repeat');
			ctx.fillStyle = pattern;
			ctx.fillRect(
				0,
				sy-1,
				sx-1,
				$(this).height()-(img.height-sy-sheight-1) - sy + 2
			);
			
			// Middle center
			var middleCenterCanvas = document.createElement('canvas');
			middleCenterCanvas.height = sheight;
			middleCenterCanvas.width = swidth;
			var middleCenterCtx = middleCenterCanvas.getContext('2d');
			middleCenterCtx.drawImage(img,
					sx,
					sy,
					swidth,
					sheight,
					0,
					0,
					swidth,
					sheight);
			
			var pattern = ctx.createPattern(middleCenterCanvas, 'repeat');
			ctx.fillStyle = pattern;
			ctx.fillRect(
				sx - 1,
				sy - 1,
				$(this).width()-(img.width-sx-swidth-1) - sx + 2,
				$(this).height()-(img.height-sy-sheight-1) - sy + 2
			);
			
			// Middle right
			var middleRightCanvas = document.createElement('canvas');
			middleRightCanvas.width = img.width-sx-swidth-1;
			middleRightCanvas.height = sheight;
			var middleRightCtx = middleRightCanvas.getContext('2d');
			middleRightCtx.drawImage(img,
					sx+swidth,
					sy,
					img.width-sx-swidth-1,
					sheight,
					0,
					0,
					img.width-sx-swidth-1,
					sheight);
			
			var pattern = ctx.createPattern(middleRightCanvas, 'repeat');
			ctx.fillStyle = pattern;
			ctx.fillRect(
				$(this).width()-(img.width-sx-swidth-2),
				sy-1,
				img.width-sx-swidth-1,
				$(this).height()-(img.height-sy-sheight-1) - sy + 2
			);
			
			// bottom center
			// TODO fix bad math
			var bottomCenterCanvas = document.createElement('canvas');
			bottomCenterCanvas.width = swidth;
			bottomCenterCanvas.height = img.height-sy-sheight-1;
			var bottomCenterCtx = bottomCenterCanvas.getContext('2d');
			bottomCenterCtx.drawImage(img,
					sx,
					sy+sheight,
					swidth,
					img.height-sy-sheight-1,
					0,
					0,
					swidth,
					img.height-sy-sheight-1);
			
			var pattern = ctx.createPattern(bottomCenterCanvas, 'repeat');
			ctx.fillStyle = pattern;
			ctx.fillRect(
				sx-1,
				$(this).height()-(img.height-sy-sheight-1),
				$(this).width()-(img.width-sx-swidth-1) - sx,
				img.height-sy-sheight-1
			);
			
			/*
			 * Corners
			 * 
			 * These corners do not need objects as they can be placed directly
			 * on the canvas
			 */
			
			// Top left corner
			ctx.drawImage(img,
					1,
					1,
					sx-1,
					sy-1,
					0,
					0,
					sx-1,
					sy-1);
			
			// Top right corner
			ctx.drawImage(img,
					sx+swidth,
					1,
					img.width-sx-swidth-1,
					sy-1,
					$(this).width()-(img.width-sx-swidth-1),
					0,
					img.width-sx-swidth-1,
					sy-1);
			
			// bottom left corner
			ctx.drawImage(img,
					1,
					sy+sheight,
					sx-1,
					img.height-sy-sheight-1,
					0,
					$(this).height()-(img.height-sy-sheight-1) + 1,
					sx-1,
					img.height-sy-sheight-1);
			
			// bottom right corner
			ctx.drawImage(img,
					sx+swidth,
					sy+sheight,
					img.width-sx-swidth-1,
					img.height-sy-sheight-1,
					$(this).width()-(img.width-sx-swidth-1),
					$(this).height()-(img.height-sy-sheight-1) + 1,
					img.width-sx-swidth-1,
					img.height-sy-sheight-1);
			
			var position = $(this).position();
			$(canvas).css('left', position.left);
			$(canvas).css('top', position.top);
			$(canvas).css('position', 'absolute');
			
			$(this).before(canvas);
			
			
			
		}
	});
	
	return;
});

function sepia(ca){
	if (!ca.i) ca.i = 0;
	var ctx = ca.getContext('2d');
	ctx.globalAlpha = 0.1;
	ctx.globalCompositeOperation = "darker";		
	ctx.fillStyle = "rgba(255,0,0,1)";
	ctx.fillRect(0,0,ca.width,ca.height);
	if (ca.i++ <= 100) setTimeout(sepia,15,ca); 
}
 
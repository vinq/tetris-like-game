jQuery(document).ready(function ($) {

	// Control Panel 

	var speedControl = $("input[type='range'][name='speed']");
	var xFigureControl = $("input[type='range'][name='xfigure']");
	var yFigureControl = $("input[type='range'][name='yfigure']");
	var xMatrixControl = $("input[type='range'][name='xmatrix']");
	var yMatrixControl = $("input[type='range'][name='ymatrix']");
	var cellSizeControl = $("input[type='range'][name='cellsize']");
	var numberControl = $("input[type='submit'][name='number']");

	var sizesTimeout = null, sizesMTimeout = null;
	
	// Init Tetris
	var t = new Tetris(speedControl.val(), [xMatrixControl.val(), yMatrixControl.val()], [xFigureControl.val(), yFigureControl.val()], cellSizeControl.val());

	// Control Panel Events and functions

	var changeSizes = function(){
		t.setFigureSizes([xFigureControl.val(), yFigureControl.val()]);
	}	

	var changeMatrixSizes = function(){
		t.stop();
		t = new Tetris(speedControl.val(), [xMatrixControl.val(), yMatrixControl.val()], [xFigureControl.val(), yFigureControl.val()], cellSizeControl.val());
	}


	speedControl.on("change", function(){
		let newSpeed = speedControl.val();
		t.setSpeed(newSpeed);
	})

	numberControl.on("click", function(){
		t.more();
	})

	cellSizeControl.on("change", function(){
		let size = cellSizeControl.val();
		t.setCellSize(size);
	})

	xFigureControl.on("change", function(){
		clearTimeout(sizesTimeout);
		sizesTimeout = setTimeout(changeSizes, 2000);
	})

	yFigureControl.on("change", function(){
		clearTimeout(sizesTimeout);
		sizesTimeout = setTimeout(changeSizes, 2000);
	})

	xMatrixControl.on("change", function(){
		clearTimeout(sizesTimeout);
		sizesMTimeout = setTimeout(changeMatrixSizes, 2000);
	})

	yMatrixControl.on("change", function(){
		clearTimeout(sizesTimeout);
		sizesMTimeout = setTimeout(changeMatrixSizes, 2000);
	})
});

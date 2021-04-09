Tetris = function(){
	var selfTetris = this;

	this.Cell = function(color, position) {
		this.color = color;
		this.position = position;
	}

	this.Figure = function(dimentions, coordinates, colors, cellSize, empty = false, cb = function(){}, matrix){

		this.dimentions = dimentions;
		this.coordinates = coordinates;
		this.matrix = matrix;

		this.cellSize = cellSize;
		this.colors = colors;
		this.array = [];
		this.directions = {
			"up": [0, -1],
			"down":[0, 1],
			"left":[-1, 0], 
			"right":[1, 0], 
		}		

		var selfFigure = this;

		this.initArray = function(){

			// Logger.log("Matrix init", selfFigure)

			selfFigure.arrayReview(function(i, j){
				if (!selfFigure.array[i]) {
					selfFigure.array[i] = {};
				}

				var color = empty ? "#FFFFFF" : (Random.getRandomBool() ? "#FFFFFF" : selfFigure.getColor());

				selfFigure.array[i][j] = new selfTetris.Cell(color, [i, j]);
			});			

			var weight = selfFigure.arrayReview().weight;

			if (weight == 0 && !empty) {
				selfFigure.initArray();
			}

			// Logger.log("Matrix creation end", selfFigure)

			cb();
		}

		this.arrayReview = function(cb = function(i,j){}, options = {}) {
			var exit = false;

			var ib = options.start ? options.start[0] : 0;
			var jb = options.start ? options.start[1] : 0;

			var ie = options.end ? options.end[0] : selfFigure.dimentions[0];
			var je = options.end ? options.end[1] : selfFigure.dimentions[1];

			var lastXtremums = [];
			var firstXtremums = [];
			var blocksByI = [];
			var weight = 0;

			for(var i = ib; i < ie; i++) {

				for(var j = jb; j < je; j++) {

					exit = cb(i, j);

					if (!blocksByI[i]) {
						blocksByI[i] = 0;
					} 

					if (selfFigure.array[i][j].color != "#FFFFFF"){

						// to do: all extremums by directions
						if (!firstXtremums[i]){
							firstXtremums[i] = j;
						}

						lastXtremums[i] = j;
						blocksByI[i]++;
						weight++;
					}

					if (j == (je - 1) && !firstXtremums[i]) {
						firstXtremums[i] = je;
					}

					if(exit) { break };
				}

				if(exit) { break };
			}

			return {
				exit: exit,
				last: lastXtremums,
				first: firstXtremums,
				blocksByI: blocksByI,
				weight: weight
			};
		}

		this.getColor = function(){
			//use self.colors get random color
			return "#111111";
		}

		this.detectCollisions = function(matrix){
			var collisionDetected = false;

			var x = selfFigure.coordinates[0];
			var y = selfFigure.coordinates[1];

			// to do: make using directions in future

			var lasts = selfFigure.arrayReview().last;

			for (var key in lasts) {

				var axeX = x + key*1;
				var matrixLimit = matrix.dimentions[1] - 1;
				var figureLastBorder = y + lasts[key] + 1;

				var conditionWithMatrixFills = matrix.array[axeX][figureLastBorder].color != "#FFFFFF";
				var conditionWithMatrixDimetions = figureLastBorder >= matrixLimit;
				
				if (conditionWithMatrixFills || conditionWithMatrixDimetions){
					collisionDetected = true;
				}
			}

			return collisionDetected;
		}

		this.getBlocksByI = function() {

			// to do: make using directions in future

			return selfFigure.arrayReview().blocksByI;
		}

		this.fall = function(){
			var direction = selfFigure.getDefaultDirection();
			selfFigure.move(direction);
		}

		this.move = function(direction){
			var x = selfFigure.coordinates[0];
			var y = selfFigure.coordinates[1];

			x += direction[0];
			y += direction[1];

			selfFigure.coordinates = [x, y];
		}

		this.moveLeft = function(){
			var direction = selfFigure.directions.left;
			selfFigure.move(direction);
		}

		this.moveRight = function(){
			var direction = selfFigure.directions.right;
			selfFigure.move(direction);
		}

		this.getDefaultDirection = function() {
			// hardcode value, this is upside down tetris
			return selfFigure.directions.down;
		}

		this.initArray();
	}

	this.Matrix = function(dimentions, coordinates, colors, cellSize, figureOptions) {
		this.fallingFigures = [];

		this.gameOver = new Event("gameOver");
		this.emptyFigures = new Event("emptyFigures");
		this.matrixReady = new Event("matrixReady");

		var selfMatrix = this;

		this.createFigure = function() {
			var center = Random.getRandomCenter(selfMatrix, figureOptions.dimentions);
			var figure = new selfTetris.Figure(figureOptions.dimentions, center, [], cellSize, false, function(){}, selfMatrix);

			selfMatrix.fallingFigures.push(figure);

			Logger.log("Matrix", selfMatrix.array);

			return figure;
		}

		this.fallFigures = function(){
			for (var fi of selfMatrix.fallingFigures) {
				fi.fall();
			}
		}

		this.doFigures = function() {
			for(var fi of selfMatrix.fallingFigures) {
				if(fi.detectCollisions(selfMatrix)){
					selfMatrix.setFigure(fi);

					// to do: removing from array clearer
					selfMatrix.fallingFigures.splice(fi, 1);
					return true;
				}
			}
		}

		this.setFigure = function(figure) {

			// to do: make by direction

			var blocksByI = figure.getBlocksByI();
			var matrixPeaks = selfMatrix.arrayReview().first;

			for (var i in blocksByI) {
				var key = i*1;
				var blocks = blocksByI[i];

				for (var j = 1; j <= blocks; j++) {
					var matrixAxesToSetFigureX = figure.coordinates[0] + key;
					var matrixPeakI = matrixPeaks[matrixAxesToSetFigureX] ? matrixPeaks[matrixAxesToSetFigureX] : selfMatrix.dimentions[1] - j;
					var matrixAxesToSetFigureY = matrixPeaks.length > 0 ? (matrixPeakI - j) : selfMatrix.dimentions[1] - j;
					
					selfMatrix.array[matrixAxesToSetFigureX][matrixAxesToSetFigureY].color = "#111111";
				}
			}
		}

		this.checks = function() {
			selfMatrix.arrayReview(function(x, y){
				if (y == 0 && selfMatrix.array[x][y].color != "#FFFFFF") {
					document.dispatchEvent(selfMatrix.gameOver);
					return true;
				}
			})

			if (selfMatrix.fallingFigures.length == 0) {
				document.dispatchEvent(selfMatrix.emptyFigures);
			}
		}

		this.base = selfTetris.Figure;
  		this.base(dimentions, coordinates, colors, cellSize, true, function(){
  			document.dispatchEvent(selfMatrix.matrixReady);
  		});
	}

	this.Matrix.prototype = Object.create(this.Figure.prototype);
	this.Matrix.prototype.constructor = this.Figure;

	this.BaseAlgorithm = function(options = {}) {
		this.gameTime = 0;
		this.gravitationAngle = 0;
		this.options = options;
		this.matrix = null;

		this.draw = new Event("draw");

		var selfBaseAlgorithm = this;

		this.timerTick = function(){
			this.gameTime++;
			selfBaseAlgorithm.doIteration();
			// draw figures
		}

		this.doIteration = function(){
			selfBaseAlgorithm.matrix.fallFigures();
			selfBaseAlgorithm.matrix.doFigures();
			selfBaseAlgorithm.matrix.checks();

			document.dispatchEvent(selfBaseAlgorithm.draw);
		}

		this.createGame = function() {
			var figureOptions = {
				dimentions: options.figureDimentions
			}, interval;

			document.addEventListener("matrixReady", function(){
				interval = setInterval(function(){
					selfBaseAlgorithm.timerTick();
				}, selfBaseAlgorithm.options.speed);
			});
				
			document.addEventListener("gameOver", function(){
				clearInterval(interval);
				Logger.log("Game Over", selfBaseAlgorithm.matrix)
			});
				
			document.addEventListener("emptyFigures", function(){
				selfBaseAlgorithm.matrix.createFigure();
			});

			selfBaseAlgorithm.matrix = new selfTetris.Matrix(options.matrixDimentions, [0,0], [], options.cellSize, figureOptions);
		}
	}

	this.canvas = document.getElementById("canvas");

	this.drawBoard = function(matrix){	
		var ctx = selfTetris.canvas.getContext("2d");

		ctx.canvas.width = matrix.dimentions[0] * matrix.cellSize;
		ctx.canvas.height = matrix.dimentions[1] * matrix.cellSize;

	    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	    matrix.arrayReview(function(x, y){

	    	var xx = x * matrix.cellSize;
	    	var yy = y * matrix.cellSize

	    	var width = matrix.cellSize - 2;
	    	var height = matrix.cellSize - 2;

			ctx.fillStyle = "green";

			if (matrix.array[x][y].color != "#FFFFFF") {
				ctx.fillStyle = "white";
			}

	    	ctx.fillRect(xx, yy, width, height);
	    })	    

	    for (var fi of matrix.fallingFigures) {
	    	fi.arrayReview(function(x, y){
	    		var xx = (fi.coordinates[0] + x) * matrix.cellSize;
		    	var yy = (fi.coordinates[1] + y) * matrix.cellSize

		    	var width = matrix.cellSize - 2;
		    	var height = matrix.cellSize - 2;		
		    	
				ctx.fillStyle = "green";

				if (fi.array[x][y].color != "#FFFFFF" || matrix.array[fi.coordinates[0] + x][fi.coordinates[1] + y].color != "#FFFFFF") {
					ctx.fillStyle = "white";
				}

		    	ctx.fillRect(xx, yy, width, height);
	    	})
	    }
	}

	this.init = function(){
		var options = {
			speed: 100,
			matrixDimentions: [30,50],
			figureDimentions: [3,2],
			cellSize: 9
		};

		var ba = new selfTetris.BaseAlgorithm(options);
		ba.createGame();

		document.addEventListener("draw", function(){
			selfTetris.drawBoard(ba.matrix);
		});
	}

	this.init();
}

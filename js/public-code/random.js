Random = {};

Random.getRandomBool = function(){
	return Math.random() > 0.5;
}

Random.getRandomArbitrary = function(min, max) {
  return Math.random() * (max - min) + min;
}

Random.getRandomCenter = function(matrix, figureDimentions){
	return [Math.ceil(Random.getRandomArbitrary(0, matrix.dimentions[0] - 2 - figureDimentions[0])), Math.ceil(matrix.dimentions[1] / 2)];
}

Logger = {};

Logger.log = function(layer, vars){
	console.log("=======" + layer + "=======");
	console.log(vars);
	console.log("===========================");
}

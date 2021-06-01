Random = {};

Random.getRandomBool = function(){
	return Math.random() > 0.5;
}

Random.getRandomArbitrary = function(min, max) {
  return Math.random() * (max - min) + min;
}

Random.getRandomCenter = function(matrix, figureDimentions){
	var randomFrom = 0, randomTo = matrix.dimentions[0] - 2 - figureDimentions[0];
	return [Math.ceil(Random.getRandomArbitrary(randomFrom, randomTo)), 0];
}

Logger = {};

Logger.log = function(layer, vars){
	console.log("=======" + layer + "=======");
	console.log(vars);
	console.log("===========================");
}

function Vector(x,y){
	this.x = x;
	this.y = y;
}

Vector.prototype.add = function(v){
	return new Vector(this.x + v.x, this.y + v.y);
}

module.exports = Vector;


var	Vector = require('./vector');

var v1 = new Vector(1,1);
var v2 = new Vector(1,1);
v1 = v1.add(v2);
console.log(v1);

function fun1()
{
	console.log("foo");
}

function fun2()
{
	var derp = 5;
	derp = 12 * derp;
}

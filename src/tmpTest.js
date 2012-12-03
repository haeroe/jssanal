function a(){
	var c = b();
	return c;
}

function b(){
	return a();
}

function c(){
	return " ";
}

var constant = 1;

eval(constant);
eval(document); //unknown varible
eval(a()); //recursive definition
eval(c());
eval('literal');

var lol = a + b + "3";

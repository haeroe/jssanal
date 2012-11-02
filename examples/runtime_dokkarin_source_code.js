var a;

function f( param ){
	var c;

	c = param;
	return c;
}

function g( param ){
	document.write( param );
}

function h( param ){
	document.write( a );
}

a = document.location;

g(f(a));
h();

// User Acceptance Test 1
// Expected result: should complain unsafe call to document.write() 

UAT_1();

function UAT_1() {
	var unsafeFromURL1 = document.URL;
	document.write(unsafeFromURL1);		// unsafe
}



// User Acceptance Test 2
// Expected result: should complain unsafe call to eval()

UAT_2();

function UAT_2() {
	var unsafeFromServer2 = serverDelegate.rpc();
	eval(unsafeFromServer2);		// unsafe
}



// User Acceptance Test 3
// Expected result: should complain unsafe assignment to innerHTML

UAT_3();

function UAT_3() {
	var unsafeFromURL3 = document.URL;
	$("#mydiv").innerHTML = "<b>" + unsafeFromURL3 + "</u>";		// unsafe
}


// User Acceptance Test 1
// Expected result: should complain unsafe call to document.write()

UAT_1();

function UAT_1() {
	var unsafeFromURL = document.URL;
	document.write(unsafeFromURL);		// unsafe
}



// User Acceptance Test 2
// Expected result: should complain unsafe call to eval()

UAT_2();

function UAT_2() {
	var unsafeFromServer = serverDelegate.rpc();
	eval(unsafeFromServer);		// unsafe
}



// User Acceptance Test 3
// Expected result: should complain unsafe assignment to innerHTML

UAT_3();

function UAT_3() {
	var unsafeFromURL = document.URL;
	$("#mydiv").innerHTML = "<b>" + unsafeFromURL + "</u>";		// unsafe
}


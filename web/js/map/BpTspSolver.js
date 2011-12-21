/*
  This encapsulates reusable functionality for resolving TSP problems on
  Google Maps.
  The authors of this code are James Tolley <info [at] gmaptools.com>
  and Geir K. Engdahl <geir.engdahl (at) gmail.com>

  For the most up-to-date version of this file, see
  http://code.google.com/p/google-maps-tsp-solver/

  To receive updates, subscribe to google-maps-tsp-solver@googlegroups.com

  version 1.0; 05/07/10

  // Usage:
  See http://code.google.com/p/google-maps-tsp-solver/
*/

(function() {

var tsp; // singleton
var gebMap;           // The map DOM object
var directionsPanel;  // The driving directions DOM object
var gebDirectionsResult;    // The driving directions returned from GMAP API
var gebDirectionsService;
var gebGeocoder;      // The geocoder for addresses
var maxTspSize = 100;  // A limit on the size of the problem, mostly to save Google servers from undue load.
var maxTspBF = 0;     // Max size for brute force, may seem conservative, but ma
var maxTspDynamic = 15;     // Max size for brute force, may seem conservative, but many browsers have limitations on run-time.
var maxSize = 10;     // Max number of waypoints in one Google driving directions request.
var maxTripSentry = 2000000000; // Approx. 63 years., this long a route should not be reached...
var avoidHighways = false; // Whether to avoid highways. False by default.
var travelMode = google.maps.DirectionsTravelMode.DRIVING;
var distIndex;
var GEO_STATUS_MSG = new Array();
GEO_STATUS_MSG[google.maps.GeocoderStatus.OK] = "Success.";
GEO_STATUS_MSG[google.maps.GeocoderStatus.INVALID_REQUEST] = "Request was invalid.";
GEO_STATUS_MSG[google.maps.GeocoderStatus.ERROR] = "There was a problem contacting the Google servers.";
GEO_STATUS_MSG[google.maps.GeocoderStatus.OVER_QUERY_LIMIT] = "The webpage has gone over the requests limit in too short a period of time.";
GEO_STATUS_MSG[google.maps.GeocoderStatus.REQUEST_DENIED] = "The webpage is not allowed to use the geocoder.";
GEO_STATUS_MSG[google.maps.GeocoderStatus.UNKNOWN_ERROR] = "A geocoding request could not be processed due to a server error. The request may succeed if you try again.";
GEO_STATUS_MSG[google.maps.GeocoderStatus.ZERO_RESULTS] = "No result was found for this GeocoderRequest.";
var DIR_STATUS_MSG = new Array();
DIR_STATUS_MSG[google.maps.DirectionsStatus.INVALID_REQUEST] = "The DirectionsRequest provided was invalid.";
DIR_STATUS_MSG[google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED] = "Too many DirectionsWaypoints were provided in the DirectionsRequest. The total allowed waypoints is 8, plus the origin and destination.";
DIR_STATUS_MSG[google.maps.DirectionsStatus.NOT_FOUND] = "At least one of the origin, destination, or waypoints could not be geocoded.";
DIR_STATUS_MSG[google.maps.DirectionsStatus.OK] = "The response contains a valid DirectionsResult.";
DIR_STATUS_MSG[google.maps.DirectionsStatus.OVER_QUERY_LIMIT] = "The webpage has gone over the requests limit in too short a period of time.";
DIR_STATUS_MSG[google.maps.DirectionsStatus.REQUEST_DENIED] = "The webpage is not allowed to use the directions service.";
DIR_STATUS_MSG[google.maps.DirectionsStatus.UNKNOWN_ERROR] = "A directions request could not be processed due to a server error. The request may succeed if you try again.";
DIR_STATUS_MSG[google.maps.DirectionsStatus.ZERO_RESULTS] = "No route could be found between the origin and destination.";
var waypoints = new Array();
var addresses = new Array();
var labels = new Array();
var addr = new Array();
var wpActive = new Array();
var addressRequests = 0;
var addressProcessing = false;
var requestNum = 0;
var currQueueNum = 0;
    var wayArr;
    var legsTmp;
    var distances;
    var durations;
    var legs;
    var dist;
    var dur;
    var visited;
    var currPath;
    var bestPath;
    var bestTrip;
    var nextSet;
    var numActive;
    var chunkNode;
    var numDirectionsComputed = 0;
    var numDirectionsNeeded = 0;
    var cachedDirections = false;

    var onSolveCallback = function(){};
    var onProgressCallback = null;
    var originalOnFatalErrorCallback = function(tsp, errMsg) { alert("Request failed: " + errMsg); }
    var onFatalErrorCallback = originalOnFatalErrorCallback;
    var doNotContinue = false;
    var abort = false;
    var onLoadListener = null;
    var onFatalErrorListener = null;

    /* Computes a near-optimal solution to the TSP problem, 
     * using Ant Colony Optimization and local optimization
     * in the form of k2-opting each candidate route.
     * Run time is O(numWaves * numAnts * numActive ^ 2) for ACO
     * and O(numWaves * numAnts * numActive ^ 3) for rewiring?
     * 
     * if mode is 1, we start at node 0 and end at node numActive-1.
     */
    function tspAntColonyK2(mode) {
	var alfa = 1.0; // The importance of the previous trails
	var beta = 1.0; // The importance of the durations
	var rho = 0.1;  // The decay rate of the pheromone trails
	var asymptoteFactor = 0.9; // The sharpness of the reward as the solutions approach the best solution
	var pher = new Array();
	var nextPher = new Array();
	var prob = new Array();
	var numAnts = 20;
	var numWaves = 20;
	for (var i = 0; i < numActive; ++i) {
	    pher[i] = new Array();
	    nextPher[i] = new Array();
	}
	for (var i = 0; i < numActive; ++i) {
	    for (var j = 0; j < numActive; ++j) {
		pher[i][j] = 1;
		nextPher[i][j] = 0.0;
	    }
	}

	var lastNode = 0;
	var startNode = 0;
	var numSteps = numActive - 1;
	var numValidDests = numActive;
	if (mode == 1) {
	    lastNode = numActive - 1;
	    numSteps = numActive - 2;
	    numValidDests = numActive - 1;
	}
	for (var wave = 0; wave < numWaves; ++wave) {
	    for (var ant = 0; ant < numAnts; ++ant) {
		var curr = startNode;
		var currDist = 0;
		for (var i = 0; i < numActive; ++i) {
		    visited[i] = false;
		}
		currPath[0] = curr;
		for (var step = 0; step < numSteps; ++step) {
      		    visited[curr] = true;
      		    var cumProb = 0.0;
      		    for (var next = 1; next < numValidDests; ++next) {
      			if (!visited[next]) {
      			    prob[next] = Math.pow(pher[curr][next], alfa) * 
      				Math.pow(dur[curr][next], 0.0 - beta);
      			    cumProb += prob[next];
      			}
      		    }
      		    var guess = Math.random() * cumProb;
      		    var nextI = -1;
      		    for (var next = 1; next < numValidDests; ++next) {
      			if (!visited[next]) {
      			    nextI = next;
      			    guess -= prob[next];
      			    if (guess < 0) {
      				nextI = next;
      				break;
      			    }
      			}
      		    }
      		    currDist += dur[curr][nextI];
      		    currPath[step+1] = nextI;
      		    curr = nextI;
		}
		currPath[numSteps+1] = lastNode;
		currDist += dur[curr][lastNode];
		
		// k2-rewire:
		var lastStep = numActive;
		if (mode == 1) {
		    lastStep = numActive - 1;
		}
		var changed = true;
		var i = 0;
		while (changed) {
      		    changed = false;
      		    for (; i < lastStep - 2 && !changed; ++i) {
      			var cost = dur[currPath[i+1]][currPath[i+2]];
      			var revCost = dur[currPath[i+2]][currPath[i+1]];
      			var iCost = dur[currPath[i]][currPath[i+1]];
      			var tmp, nowCost, newCost;
      			for (var j = i+2; j < lastStep && !changed; ++j) {
      			    nowCost = cost + iCost + dur[currPath[j]][currPath[j+1]];
      			    newCost = revCost + dur[currPath[i]][currPath[j]]
      				+ dur[currPath[i+1]][currPath[j+1]];
      			    if (nowCost > newCost) {
      				currDist += newCost - nowCost;
      				// Reverse the detached road segment.
      				for (var k = 0; k < Math.floor((j-i)/2); ++k) {
      				    tmp = currPath[i+1+k];
      				    currPath[i+1+k] = currPath[j-k];
      				    currPath[j-k] = tmp;
      				}
      				changed = true;
      				--i;
      			    }
      			    cost += dur[currPath[j]][currPath[j+1]];
      			    revCost += dur[currPath[j+1]][currPath[j]];
      			}
      		    }
		}

		if (currDist < bestTrip) {
      		    bestPath = currPath;
      		    bestTrip = currDist;
		}
		for (var i = 0; i <= numSteps; ++i) {
      		    nextPher[currPath[i]][currPath[i+1]] += (bestTrip - asymptoteFactor * bestTrip) / (numAnts * (currDist - asymptoteFactor * bestTrip));
		}
	    }
	    for (var i = 0; i < numActive; ++i) {
		for (var j = 0; j < numActive; ++j) {
      		    pher[i][j] = pher[i][j] * (1.0 - rho) + rho * nextPher[i][j];
      		    nextPher[i][j] = 0.0;
		}
	    }
	}
    }

    /* Returns the optimal solution to the TSP problem.
     * Run-time is O((numActive-1)!).
     * Prerequisites: 
     * - numActive contains the number of locations
     * - dur[i][j] contains weight of edge from node i to node j
     * - visited[i] should be false for all nodes
     * - bestTrip is set to a very high number
     *
     * If mode is 1, it will return the optimal solution to the related
     * problem of finding a path from node 0 to node numActive - 1, visiting
     * the in-between nodes in the best order.
     */
    function tspBruteForce(mode, currNode, currLen, currStep) {
	// Set mode parameters:
	var numSteps = numActive;
	var lastNode = 0;
	var numToVisit = numActive;
	if (mode == 1) {
	    numSteps = numActive - 1;
	    lastNode = numActive - 1;
	    numToVisit = numActive - 1;
	}

	// If this route is promising:
	if (currLen + dur[currNode][lastNode] < bestTrip) {

	    // If this is the last node:
	    if (currStep == numSteps) {
		currLen += dur[currNode][lastNode];
		currPath[currStep] = lastNode;
		bestTrip = currLen;
		for (var i = 0; i <= numSteps; ++i) {
		    bestPath[i] = currPath[i];
		}
	    } else {

		// Try all possible routes:
		for (var i = 1; i < numToVisit; ++i) {
		    if (!visited[i]) {
			visited[i] = true;
			currPath[currStep] = i;
			tspBruteForce(mode, i, currLen+dur[currNode][i], currStep+1);
			visited[i] = false;
		    }
		}
	    }
	}
    }

    /* Finds the next integer that has num bits set to 1.
     */
    function nextSetOf(num) {
	var count = 0;
	var ret = 0;
	for (var i = 0; i < numActive; ++i) {
	    count += nextSet[i];
	}
	if (count < num) {
	    for (var i = 0; i < num; ++i) {
		nextSet[i] = 1;
	    }
	    for (var i = num; i < numActive; ++i) {
		nextSet[i] = 0;
	    }
	} else {
	    // Find first 1
	    var firstOne = -1;
	    for (var i = 0; i < numActive; ++i) {
		if (nextSet[i]) {
		    firstOne = i;
		    break;
		}
	    }
	    // Find first 0 greater than firstOne
	    var firstZero = -1;
	    for (var i = firstOne + 1; i < numActive; ++i) {
		if (!nextSet[i]) {
		    firstZero = i;
		    break;
		}
	    }
	    if (firstZero < 0) {
		return -1;
	    }
	    // Increment the first zero with ones behind it
	    nextSet[firstZero] = 1;
	    // Set the part behind that one to its lowest possible value
	    for (var i = 0; i < firstZero - firstOne - 1; ++i) {
		nextSet[i] = 1;
	    }
	    for (var i = firstZero - firstOne - 1; i < firstZero; ++i) {
		nextSet[i] = 0;
	    }
	}
	// Return the index for this set
	for (var i = 0; i < numActive; ++i) {
	    ret += (nextSet[i]<<i);
	}
	return ret;
    }

    /* Solves the TSP problem to optimality. Memory requirement is
     * O(numActive * 2^numActive)
     */
    function tspDynamic(mode) {
	var numCombos = 1<<numActive;
	var C = new Array();
	var parent = new Array();
	for (var i = 0; i < numCombos; ++i) {
	    C[i] = new Array();
	    parent[i] = new Array();
	    for (var j = 0; j < numActive; ++j) {
		C[i][j] = 0.0;
		parent[i][j] = 0;
	    }
	}
	for (var k = 1; k < numActive; ++k) {
	    var index = 1 + (1<<k);
	    C[index][k] = dur[0][k];
	}
	for (var s = 3; s <= numActive; ++s) {
	    for (var i = 0; i < numActive; ++i) {
		nextSet[i] = 0;
	    }
	    var index = nextSetOf(s);
	    while (index >= 0) {
		for (var k = 1; k < numActive; ++k) {
		    if (nextSet[k]) {
			var prevIndex = index - (1<<k);
			C[index][k] = maxTripSentry;
			for (var m = 1; m < numActive; ++m) {
			    if (nextSet[m] && m != k) {
				if (C[prevIndex][m] + dur[m][k] < C[index][k]) {
				    C[index][k] = C[prevIndex][m] + dur[m][k];
				    parent[index][k] = m;
				}
			    }
			}
		    }
		}
		index = nextSetOf(s);
	    }
	}
	for (var i = 0; i < numActive; ++i) {
	    bestPath[i] = 0;
	}
	var index = (1<<numActive)-1;
	if (mode == 0) {
	    var currNode = -1;
	    bestPath[numActive] = 0;
	    for (var i = 1; i < numActive; ++i) {
		if (C[index][i] + dur[i][0] < bestTrip) {
		    bestTrip = C[index][i] + dur[i][0];
		    currNode = i;
		}
	    }
	    bestPath[numActive-1] = currNode;
	} else {
	    var currNode = numActive - 1;
	    bestPath[numActive-1] = numActive - 1;
	    bestTrip = C[index][numActive-1];
	}
	for (var i = numActive - 1; i > 0; --i) {
	    currNode = parent[index][currNode];
	    index -= (1<<bestPath[i]);
	    bestPath[i-1] = currNode;
	}
    }  

    function makeLatLng(latLng) {
	return(latLng.toString().substr(1,latLng.toString().length-2));
    }

    function makeDirWp(latLng) {
	return ({ location: latLng,
		  stopover: true });
    }

    function getWayArr(curr) {
	var nextAbove = -1;
	for (var i = curr + 1; i < waypoints.length; ++i) {
	    if (wpActive[i]) {
		if (nextAbove == -1) {
		    nextAbove = i;
		} else {
		    wayArr.push(makeDirWp(waypoints[i]));
		    wayArr.push(makeDirWp(waypoints[curr]));
		}
	    }
	}
	if (nextAbove != -1) {
	    wayArr.push(makeDirWp(waypoints[nextAbove]));
	    getWayArr(nextAbove);
	    wayArr.push(makeDirWp(waypoints[curr]));
	}
    }

    function getDistTable(curr, currInd) {
	var nextAbove = -1;
	var index = currInd;
	for (var i = curr + 1; i < waypoints.length; ++i) {
	    if (wpActive[i]) {
		index++;
		if (nextAbove == -1) {
		    nextAbove = i;
		} else {
		    legs[currInd][index] = legsTmp[distIndex];
		    dist[currInd][index] = distances[distIndex];
		    dur[currInd][index] = durations[distIndex++];
		    legs[index][currInd] = legsTmp[distIndex];
		    dist[index][currInd] = distances[distIndex];
		    dur[index][currInd] = durations[distIndex++];
		}
	    }
	}
	if (nextAbove != -1) {
	    legs[currInd][currInd+1] = legsTmp[distIndex];
	    dist[currInd][currInd+1] = distances[distIndex];
	    dur[currInd][currInd+1] = durations[distIndex++];
	    getDistTable(nextAbove, currInd+1);
	    legs[currInd+1][currInd] = legsTmp[distIndex];
	    dist[currInd+1][currInd] = distances[distIndex];
	    dur[currInd+1][currInd] = durations[distIndex++];
	}
    }

    function directions(mode) {
	if (cachedDirections) {
	    // Bypass Google directions lookup if we already have the distance
	    // and duration matrices.
	    doTsp(mode);
	}
	wayArr = new Array();
	numActive = 0;
	numDirectionsComputed = 0;
	for (var i = 0; i < waypoints.length; ++i) {
	    if (wpActive[i]) ++numActive;
	}
	numDirectionsNeeded = numActive * (numActive - 1);

	for (var i = 0; i < waypoints.length; ++i) {
	    if (wpActive[i]) {
		wayArr.push(makeDirWp(waypoints[i]));
		getWayArr(i);
		break;
	    }
	}

	// Roundtrip
	if (numActive > maxTspSize) {
	    alert("Too many locations! You have " + numActive + ", but max limit is " + maxTspSize);
	} else {
	    legsTmp = new Array();
	    distances = new Array();
	    durations = new Array();
	    chunkNode = 0;
	    if (typeof onProgressCallback == 'function') {
		onProgressCallback(tsp);
	    }
	    nextChunk(mode);
	}
    }

    function nextChunk(mode) {
	if (chunkNode < wayArr.length && abort !== true) {
	    var wayArrChunk = new Array();
	    for (var i = 0; i < maxSize && i + chunkNode < wayArr.length; ++i) {
		wayArrChunk.push(wayArr[chunkNode+i]);
	    }
	    var origin = wayArrChunk[0].location;
	    var destination = wayArrChunk[wayArrChunk.length-1].location;
	    var wayArrChunk2 = new Array();
	    for (var i = 1; i < wayArrChunk.length - 1; i++) {
		wayArrChunk2[i-1] = wayArrChunk[i];
	    }
	    chunkNode += maxSize;
	    if (chunkNode < wayArr.length-1) {
		chunkNode--;
	    }
	    
	    var myGebDirections = new google.maps.DirectionsService();
	    
	    myGebDirections.route({
		origin: origin,
		destination: destination,
		waypoints: wayArrChunk2,
		avoidHighways: avoidHighways,
		travelMode: travelMode }, 
				  function(directionsResult, directionsStatus) {
				      if (directionsStatus != google.maps.DirectionsStatus.OK) {
					  var errorMsg = DIR_STATUS_MSG[directionsStatus];
					  var doNotContinue = true;
					  alert("Request failed: " + errorMsg);
				      } else {
					  //alert("Request completed!");
					  // Save legs, distances and durations
					  for (var i = 0; i < directionsResult.routes[0].legs.length; ++i) {
					      ++numDirectionsComputed;
					      legsTmp.push(directionsResult.routes[0].legs[i]);
					      durations.push(directionsResult.routes[0].legs[i].duration.value);
    					      distances.push(directionsResult.routes[0].legs[i].distance.value);
					  }
					  onProgressCallback(tsp);
    				      }
    				      nextChunk(mode);
				  });
	} else {
	    readyTsp(mode);
	}
    }

    function readyTsp(mode) {
	//alert("readyTsp");
	// Get distances and durations into 2-d arrays:
	distIndex = 0;
	legs = new Array();
	dist = new Array();
	dur = new Array();
	numActive = 0;
	for (var i = 0; i < waypoints.length; ++i) {
	    if (wpActive[i]) {
		legs.push(new Array());
		dist.push(new Array());
		dur.push(new Array());
		addr[numActive] = addresses[i];
		numActive++;
	    }
	}
	for (var i = 0; i < numActive; ++i) {
	    legs[i][i] = null;
	    dist[i][i] = 0;
	    dur[i][i] = 0;
	}
	for (var i = 0; i < waypoints.length; ++i) {
	    if (wpActive[i]) {
		getDistTable(i, 0);
		break;
	    }
	}

	doTsp(mode);
    }

    function doTsp(mode) {
	//alert("doTsp");
	// Calculate shortest roundtrip:
	visited = new Array();
	for (var i = 0; i < numActive; ++i) {
	    visited[i] = false;
	}
	currPath = new Array();
	bestPath = new Array();
	nextSet = new Array();
	bestTrip = maxTripSentry;
	visited[0] = true;
	currPath[0] = 0;
	cachedDirections = true;
	if (numActive <= maxTspBF + mode) {
	    tspBruteForce(mode, 0, 0, 1);
	} else if (numActive <= maxTspDynamic + mode) {
	    tspDynamic(mode);
	} else {
	    tspAntColonyK2(mode);
	}

	var wpIndices = new Array();
	for (var i = 0; i < waypoints.length; ++i) {
	    if (wpActive[i]) {
		wpIndices.push(i);
	    }
	}
	var bestPathLatLngStr = "";
	var directionsResultLegs = new Array();
	var directionsResultRoutes = new Array();
	var directionsResultBounds = new google.maps.LatLngBounds();
	for (var i = 1; i < bestPath.length; ++i) {
	    directionsResultLegs.push(legs[bestPath[i-1]][bestPath[i]]);
	}
	for (var i = 0; i < bestPath.length; ++i) {
	    bestPathLatLngStr += makeLatLng(waypoints[wpIndices[bestPath[i]]]) + "\n";
	    directionsResultBounds.extend(waypoints[wpIndices[bestPath[i]]]);
	}
	directionsResultRoutes.push({ 
	    legs: directionsResultLegs,
	    bounds: directionsResultBounds });
	gebDirectionsResult = { routes: directionsResultRoutes };
	//alert(bestPathLatLngStr);

	if (onFatalErrorListener)
	    google.maps.event.removeListener(onFatalErrorListener);
	onFatalErrorListener = google.maps.event.addListener(gebDirectionsService, 'error', onFatalErrorCallback);

	/*
	  wayArrChunkStr = "";
	  for (var i = 0; i < wayArrChunk.length; ++i) {
	  wayArrChunkStr += wayArrChunk[i].location.toString() + ", ";
	  }
	  alert("origin = " + origin.toString() + "\n"
	  + "destination = " + destination.toString() + "\n"
	  + "wayArrChunk = " + wayArrChunkStr);
	*/
	if (typeof onSolveCallback == 'function') {
	    onSolveCallback(tsp);
	}
    }

    function addWaypoint(latLng, label) {
	var freeInd = -1;
	for (var i = 0; i < waypoints.length; ++i) {
	    if (!wpActive[i]) {
		freeInd = i;
		break;
	    }
	}
	if (freeInd == -1) {
	    if (waypoints.length < maxTspSize) {
		waypoints.push(latLng);
		labels.push(label);
		wpActive.push(true);
		freeInd = waypoints.length-1;
	    } else {
		return(-1);
	    }
	} else {
	    waypoints[freeInd] = latLng;
	    labels[freeInd] = label;
	    wpActive[freeInd] = true;
	}
	return(freeInd);
    }

    function addAddress(address, label, callback) {
	addressProcessing = true;
	gebGeocoder.geocode({ address: address }, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
		addressProcessing = false;
		--addressRequests;
		++currQueueNum;
		if (results.length >= 1) {
		    var latLng = results[0].geometry.location;
    		    var freeInd = addWaypoint(latLng, label);
    		    addresses[freeInd] = address;
		    if (typeof callback == 'function')
			callback(address, latLng);
		}
	    } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
		setTimeout(function(){ addAddress(address, label, callback) }, 100); 
	    } else {
		--addressRequests;
		alert(GEO_STATUS_MSG[status]);
		++currQueueNum;
		addressProcessing = false;
		if (typeof(callback) == 'function')
		    callback(address);
	    }
	});
    }

    function swapWaypoints(i, j) {
	var tmpAddr = addresses[j];
	var tmpWaypoint = waypoints[j];
	var tmpActive = wpActive[j];
	var tmpLabel = labels[j];
	addresses[j] = addresses[i];
	addresses[i] = tmpAddr;
	waypoints[j] = waypoints[i];
	waypoints[i] = tmpWaypoint;
	wpActive[j] = wpActive[i];
	wpActive[i] = tmpActive;
	labels[j] = labels[i];
	labels[i] = tmpLabel;
    }

    BpTspSolver.prototype.startOver = function() {
	waypoints = new Array();
	addresses = new Array();
	labels = new Array();
	addr = new Array();
	wpActive = new Array();
	wayArr = new Array();
	legsTmp = new Array();
	distances = new Array();
	durations = new Array();
	legs = new Array();
	dist = new Array();
	dur = new Array();
	visited = new Array();
	currPath = new Array();
	bestPath = new Array();
	bestTrip = new Array();
	nextSet = new Array();
	numActive = 0;
	chunkNode = 0;
	addressRequests = 0;
	addressProcessing = false;
	requestNum = 0;
	currQueueNum = 0;
	cachedDirections = false;
	onSolveCallback = function(){};
	onProgressCallback = null;
	doNotContinue = false;
    }
    
    /* end (edited) OptiMap code */
    /* start public interface */

    function BpTspSolver(map, panel, onFatalError) {
	if (tsp) {
	    alert('You can only create one BpTspSolver at a time.');
	    return;
	}

	gebMap               = map;
	directionsPanel      = panel;
	gebGeocoder          = new google.maps.Geocoder();
	gebDirectionsService = new google.maps.DirectionsService();
	onFatalErrorCallback = onFatalError; // only for fatal errors, not geocoding errors
	tsp                  = this;
    }

    BpTspSolver.prototype.addAddressWithLabel = function(address, label, callback) {
	++addressRequests;
	++requestNum;
	tsp.addAddressAgain(address, label, callback, requestNum - 1);	
    }

    BpTspSolver.prototype.addAddress = function(address, callback) {
	tsp.addAddressWithLabel(address, null, callback);
    };

    BpTspSolver.prototype.addAddressAgain = function(address, label, callback, queueNum) {
	if (addressProcessing || queueNum > currQueueNum) {
	    setTimeout(function(){ tsp.addAddressAgain(address, label, callback, queueNum) }, 100);
	    return;
	}
	addAddress(address, label, callback);
    };

    BpTspSolver.prototype.addWaypointWithLabel = function(latLng, label, callback) {
    	++requestNum;
    	tsp.addWaypointAgain(latLng, label, callback, requestNum - 1);
    };

    BpTspSolver.prototype.addWaypoint = function(latLng, callback) {
	    tsp.addWaypointWithLabel(latLng, null, callback);
    };

    BpTspSolver.prototype.addWaypointAgain = function(latLng, label, callback, queueNum) {
      if (addressProcessing || queueNum > currQueueNum) {
    	    setTimeout(function(){ tsp.addWaypointAgain(latLng, label, callback, queueNum) }, 100);
    	    return;
    	}
	     addWaypoint(latLng, label);
     	++currQueueNum;     
	if (typeof(callback) == 'function') {
	     callback(latLng);     
	}
    }

    BpTspSolver.prototype.getWaypoints = function() {
	var wp = [];
	for (var i = 0; i < waypoints.length; i++) {
	    if (wpActive[i]) {
		wp.push(waypoints[i]);
	    }
	}
	return wp;
    };

    BpTspSolver.prototype.getAddresses = function() {
	var addrs = [];
	for (var i = 0; i < addresses.length; i++) {
	    if (wpActive[i])
		addrs.push(addresses[i]);
	}
	return addrs;
    };

    BpTspSolver.prototype.getLabels = function() {
	var labs = [];
	for (var i = 0; i < labels.length; i++) {
	    if (wpActive[i])
		labs.push(labels[i]);
	}
	return labs;
    };

    BpTspSolver.prototype.removeWaypoint = function(latLng) {
	for (var i = 0; i < waypoints.length; ++i) {
	    if (wpActive[i] && waypoints[i].equals(latLng)) {
		wpActive[i] = false;
		return true;
	    }
	}
	return false;
    };

    BpTspSolver.prototype.removeAddress = function(addr) {
	for (var i = 0; i < addresses.length; ++i) {
	    if (wpActive[i] && addresses[i] == addr) {
		wpActive[i] = false;
		return true;
	    }
	}
	return false;
    };

    BpTspSolver.prototype.setAsStop = function(latLng) {
	var j = -1;
	for (var i = waypoints.length - 1; i >= 0; --i) {
	    if (j == -1 && wpActive[i]) {
		j = i;
	    }
	    if (wpActive[i] && waypoints[i].equals(latLng)) {
		for (var k = i; k < j; ++k) {
		    swapWaypoints(k, k + 1);
		}
		break;
	    }
	}
    }

    BpTspSolver.prototype.setAsStart = function(latLng) {
	var j = -1;
	for (var i = 0; i < waypoints.length; ++i) {
	    if (j == -1 && wpActive[i]) {
		j = i;
	    }
	    if (wpActive[i] && waypoints[i].equals(latLng)) {
		for (var k = i; k > j; --k) {
		    swapWaypoints(k, k - 1);
		}
		break;
	    }
	}
    }

    BpTspSolver.prototype.getGDirections = function() {
	return gebDirectionsResult;
    };

    BpTspSolver.prototype.getGDirectionsService = function() {
	return gebDirectionsService;
    };

    // Returns the order that the input locations was visited in.
    //   getOrder()[0] is always the starting location.
    //   getOrder()[1] gives the first location visited, getOrder()[2]
    //   gives the second location visited and so on.
    BpTspSolver.prototype.getOrder = function() {
	return bestPath;
    }

    // Methods affecting the way driving directions are computed
    BpTspSolver.prototype.getAvoidHighways = function() {
	return avoidHighways;
    }

    BpTspSolver.prototype.setAvoidHighways = function(avoid) {
	avoidHighways = avoid;
    }

    BpTspSolver.prototype.getTravelMode = function() {
	return travelMode;
    }

    BpTspSolver.prototype.setTravelMode = function(travelM) {
	travelMode = travelM;
    }

    BpTspSolver.prototype.getDurations = function() {
	return dur;
    }

    // Helper functions
    BpTspSolver.prototype.getTotalDuration = function() {
	return gebDirections.getDuration().seconds;
    }

    // we assume that we have enough waypoints
    BpTspSolver.prototype.isReady = function() {
	return addressRequests == 0;
    };

    BpTspSolver.prototype.solveRoundTrip = function(callback) {
	if (doNotContinue) {
	    alert('Cannot continue after fatal errors.');
	    return;
	}

	if (!this.isReady()) {
	    setTimeout(function(){ tsp.solveRoundTrip(callback) }, 20);
	    return;
	}
	if (typeof callback == 'function')
	    onSolveCallback = callback;

	directions(0);
    };
    
     BpTspSolver.prototype.isAborted = function(){
     return  abor;;
    }
    BpTspSolver.prototype.abort = function(){
      abort=true;
    
    
    BpTspSolver.prototype.reset = function(){
      abort=false;
    }
    }

    BpTspSolver.prototype.solveAtoZ = function(callback) {
	if (doNotContinue) {
	    alert('Cannot continue after fatal errors.');
	    return;
	}

	if (!this.isReady()) {
	    setTimeout(function(){ tsp.solveAtoZ(callback) }, 20);
	    return;
	}

	if (typeof callback == 'function')
	    onSolveCallback = callback;

	directions(1);
    };

    BpTspSolver.prototype.setOnProgressCallback = function(callback) {
	onProgressCallback = callback;
    }

    BpTspSolver.prototype.getNumDirectionsComputed = function () {
	return numDirectionsComputed;
    }

    BpTspSolver.prototype.getNumDirectionsNeeded = function () {
	return numDirectionsNeeded;
    }

    window.BpTspSolver = BpTspSolver;
    
})();

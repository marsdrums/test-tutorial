var threshold = 0.8;
declareattribute("threshold", null, "setthreshold", 0);
function setthreshold(v){ 
	threshold = v;	
}

function dot(a,b){ return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }

function dictionary(dictionaryName) {

	// Create a reference to the Max dictionary using the dictionary name
	let d = new Dict(dictionaryName);

	// Turn this into a JavaScript object
	let fullGeometryDesc = JSON.parse(d.stringify());

	// Get the first geometry
	let geom = fullGeometryDesc.geomlist[0];
	
	// Get the edges from that geometry
	let edges = geom.edges;

	// Make a structure to store the vertices of each line
	let contourVertices = [];

	// Go through all the edges
	edges.forEach(edge => {

		// An edge has one property, a list of the two half edge indexes
		let he0 = edge.halfedges[0];
		let he1 = edge.halfedges[1];

		// get the index of the faces divided by this edge
		let face0 = geom.halfedges[he0].face;
		let face1 = geom.halfedges[he1].face;

		// get their face normals
		let normal0 = geom.faces[face0].normal;
		let normal1 = geom.faces[face1].normal;

		// compute the cosine of the angle formed by the two faces
		let cosine = dot(normal0, normal1);

		// if the cosine is minor than threshold, draw the contour!
		if(cosine < threshold){

			// Get the actual vertex structure from the geometry
			let v0 = geom.vertices[geom.halfedges[he0].from];
			let v1 = geom.vertices[geom.halfedges[he0].to];

			// Push the points into the list
			contourVertices.push(v0.point);
			contourVertices.push(v1.point);
		}

	});

	// The contour will be a simple list of points, so we
	// make a 3-plane matrix to store all the vertices
	let mLines = new JitterMatrix(3, "float32", contourVertices.length);

	// Set each cell of the matrix to be equal to one of the vertices
	contourVertices.forEach((vertex, idx) => {
		mLines.setcell(idx, "val", vertex)
	});

	// Send out the Jitter matrix
	outlet(0, "jit_matrix", mLines.name);
}
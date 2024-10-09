var thickness = 0.1;
declareattribute("thickness", null, "setthickness", 0);
function setthickness(v){ 
	thickness = v;	
}

function normalize(x){
	let l = Math.sqrt(x[0]*x[0] + x[1]*x[1] + x[2]*x[2]);
	return [x[0]/l, x[1]/l, x[2]/l];
}

function translate(pos, dir){
	return [pos[0] - dir[0]*thickness,
			pos[1] - dir[1]*thickness,
			pos[2] - dir[2]*thickness];
}

function dictionary(dictionaryName) {

	// Create a reference to the Max dictionary using the dictionary name
	let d = new Dict(dictionaryName);

	// Turn this into a JavaScript object
	let fullGeometryDesc = JSON.parse(d.stringify());

	// Get the first geometry
	let geom = fullGeometryDesc.geomlist[0];
	
	// Get the faces from that geometry
	let faces = geom.faces;

	// Make a structure to store the vertices of each triangle
	let triangleVertices = [];

	// Go through all the faces
	faces.forEach(face => {

		// get two halfedges on this face
		let he0 = face.halfedge;
		let he1 = geom.halfedges[he0].next;

		// get the index of the vertices of this face
		let v0 = geom.halfedges[he0].from;
		let v1 = geom.halfedges[he1].from;
		let v2 = geom.halfedges[he1].to;

		// get the vertex normals
		let n0 = geom.vertices[v0].normal;
		let n1 = geom.vertices[v1].normal;
		let n2 = geom.vertices[v2].normal;

		// get the position of the vertices
		let p0 = geom.vertices[v0].point;
		let p1 = geom.vertices[v1].point;
		let p2 = geom.vertices[v2].point;

		// create 3 new positions based on p0, p1, and p2, shifted by "thickness" along thery normal vector
		let pt0 = translate(p0, n0);
		let pt1 = translate(p1, n0);
		let pt2 = translate(p2, n0);

		// Push the points into the list
		// top face
		triangleVertices.push(p0);
		triangleVertices.push(p1);
		triangleVertices.push(p2);

		// bottom face
		triangleVertices.push(pt0);
		triangleVertices.push(pt1);
		triangleVertices.push(pt2);


		// side faces
		triangleVertices.push(p0);
		triangleVertices.push(pt0);
		triangleVertices.push(p1);

		triangleVertices.push(p1);
		triangleVertices.push(pt0);
		triangleVertices.push(pt1);

		triangleVertices.push(p1);
		triangleVertices.push(pt1);
		triangleVertices.push(p2);

		triangleVertices.push(p2);
		triangleVertices.push(pt1);
		triangleVertices.push(pt2);

		triangleVertices.push(p2);
		triangleVertices.push(pt2);
		triangleVertices.push(p0);

		triangleVertices.push(p0);
		triangleVertices.push(pt2);
		triangleVertices.push(pt0);

	});

	// make a 3-plane matrix to store all the vertices
	let mTri = new JitterMatrix(3, "float32", triangleVertices.length);

	// Set each cell of the matrix to be equal to one of the vertices
	triangleVertices.forEach((vertex, idx) => {
		mTri.setcell(idx, "val", vertex)
	});

	// Send out the Jitter matrix
	outlet(0, "jit_matrix", mTri.name);
}
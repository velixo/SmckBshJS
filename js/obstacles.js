/** Returns an object with info about the collision. collidedEdge can take
 * following values:
 * l: if collision occured on the objects left edge,
 * r: if collision occured on the objects right edge,
 * t: if collision occured on the objects top edge,
 * b: if collision occured on the objects bottom edge,
 * i: if the colliding object is inside this object */
function CollisionInfo(collidedObj, collidedX, collidedY, collidedEdge) {
	this.collidedObj = collidedObj;
	this.collidedX = collidedX;
	this.collidedY = collidedY;
	this.collidedEdge = collidedEdge;
	this.toString = function() {
		return "[CollisionInfo: " + collidedObj.name + ", " + collidedX + ", "
								+ collidedY + ", " + collidedEdge + "]"
	}
}

function Rectangle(x, y, width, height, name, includeInWorld) {
	Entity.call(this, x, y, name);
	this.width = width;
	this.height = height;
	includeInWorld = evalArg(includeInWorld, true);
	if (includeInWorld) world.add(this);
}

Rectangle.prototype.update = function() {
	//implement
}

Rectangle.prototype.draw = function() {
	drawRect(this.x, this.y, this.width, this.height);
}

Rectangle.prototype.getCollisionsWithWorld = function() {
	var collisions = [];
	for (var i = 0; i < world.obstacles.length; i++) {
		var collInfo = this.collidesWith(world.obstacles[i]);
		if (collInfo !== null && collInfo.collidedObj !== this) {
			collisions.push(collInfo);
		}
	};
	return collisions;
}

Rectangle.prototype.collidesWith = function(other) {
	var edges = this._getEdges(other)
	var xColl = this._checkXCollision(edges);
	var yColl = this._checkYCollision(edges);
	collEdgeStr = xColl.collXEdgeStr + yColl.collYEdgeStr;
	if (collEdgeStr.length > 0) {
		return new CollisionInfo(other, xColl.collXEdge, yColl.collYEdge, collEdgeStr);
	}
	return null;
}

Rectangle.prototype._checkXCollision = function(edges) {
	var l = edges.lEdge;
	var r = edges.rEdge;
	var ol = edges.otherLEdge;
	var or = edges.otherREdge;
	var mx = edges.middleX;

	var crossingLeft = (l < or) && !(r < or);
	var crossingRight = (r > ol) && !(l > ol);
	var insideX = (r > ol) && (l > ol) && (l < or) && (r < or);

	var collXEdge = undefined;
	var collXEdgeStr = '';
	if (this.__collidesOnYAxis(edges)) {
		if (crossingRight) {
			collXEdge = ol;
			collXEdgeStr = 'r';
		} else if (crossingLeft) {
			collXEdge = or;
			collXEdgeStr = 'l';
		} else if (insideX) {
			collXEdge = (mx - l < r - mx) ? l : r;
			collXEdgeStr = 'i';
		}
	}
	return {
		collXEdge: collXEdge,
		collXEdgeStr: collXEdgeStr
	};
}

Rectangle.prototype._checkYCollision = function(edges) {
	var t = edges.tEdge;
	var b = edges.bEdge;
	var ot = edges.otherTEdge;
	var ob = edges.otherBEdge;
	var my = edges.middleY;

	var crossingTop = (t < ob) && !(b < ob);
	var crossingBottom = (b >= ot) && !(t >= ot);
	var insideY = (b > ot) && (t > ot) && (t < ob) && (b < ob);

	var collYEdge = undefined;
	var collYEdgeStr = '';
	if (this.__collidesOnXAxis(edges)) {
		if (crossingBottom) {
			collYEdge = ot;
			collYEdgeStr = 'b';
		} else if (crossingTop) {
			collYEdge = ob;
			collYEdgeStr = 't';
		} else if (insideY) {
			collYEdge = (my - t < b - my) ? t : b;
			collYEdgeStr = 'j';
		}
	}
	return {
		collYEdge: collYEdge,
		collYEdgeStr: collYEdgeStr
	};
}

Rectangle.prototype.__collidesOnXAxis = function(edges) {
	var ol = edges.otherLEdge;
	var or = edges.otherREdge;
	var mx = edges.middleX;
	var my = edges.middleY;
	return mx > ol && mx < or;
}

Rectangle.prototype.__collidesOnYAxis = function(edges) {
	var t = edges.tEdge;
	var b = edges.bEdge;
	var ot = edges.otherTEdge;
	var ob = edges.otherBEdge;
//	var crossingBottom = (b > ot) && !(t > ot) && (t < ob) && (b < ob);
//	var crossingTop = (b > ot) && (t > ot) && (t < ob) && !(b < ob);
	var crossingTop = (t < ob) && !(b < ob);
	var crossingBottom = (b > ot) && !(t > ot);
	var inside = (b > ot) && (t > ot) && (t < ob) && (b < ob);
	return (crossingTop || crossingBottom || inside);
}

Rectangle.prototype._getEdges = function(other) {
	return {
		lEdge: this.x,
		rEdge: this.x + this.width,
		tEdge: this.y,
		bEdge: this.y + this.height,
		middleX: this.x + this.width / 2,
		middleY: this.y + this.height / 2,
		otherLEdge: other.x,
		otherREdge: other.x + other.width,
		otherTEdge: other.y,
		otherBEdge: other.y + other.height,
		otherMiddleX: other.x + other.width / 2,
		otherMiddleY: other.y + other.height / 2
	};
}



function Floor(thickness) {
	Rectangle.call(this, 0, canvas.height - thickness, canvas.width, thickness, "floor");
	this.name = 'floor';
}
Floor.prototype = Object.create(Rectangle.prototype);
Floor.prototype.update = function() {
	this.y = canvas.height - this.height;
	this.width = canvas.width;
}




function Wall(alignment, thickness) {
	this.alignment = alignment;

	if (alignment === 'l') {
		Rectangle.call(this, 0, 0, thickness, canvas.height, alignment + " wall");
	} else if (alignment === 'r') {
		Rectangle.call(this, canvas.width - thickness, 0, thickness, canvas.height, alignment + " wall");
	}
}
Wall.prototype = Object.create(Rectangle.prototype);
Wall.prototype.update = function() {
	if (this.alignment === 'l') {
		this.x = 0;
	} else if (this.alignment === 'r') {
		this.x = canvas.width - this.width;
	}
	this.height = canvas.height;
}
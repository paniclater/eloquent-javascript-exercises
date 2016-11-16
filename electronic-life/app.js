//DIRECTIONS
var directions = {
  north:     new Vector(0, -1),
  northEast: new Vector(1, -1),
  east:      new Vector(1, 0),
  southEast: new Vector(1, 1),
  south:     new Vector(0, 1),
  southWest: new Vector(-1, 1),
  west:      new Vector(-1, 0),
  northWest: new Vector(-1, -1)
};
var directionNames = Object.keys(directions);
function directionPlus (direction, modifier) {
  var index = directionNames.indexOf(direction);
  return directionNames[(index + modifier + 8) % 8];
}

//RANDOM ELEMENT FROM ARRAY
function randomElement (array) {
  return array[Math.floor(Math.random() * array.length)];
}

//VECTOR && GRID
function Vector (x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function (other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

function Grid (width, height) {
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
}
Grid.prototype.isInside = function (vector) {
  return vector.x >=0 &&
         vector.x < this.width &&
         vector.y >=0 &&
         vector.y < this.height;
};
Grid.prototype.get = function (vector) {
  return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function (vector, value) {
  this.space[vector.x + this.width * vector.y] = value;
};
Grid.prototype.forEach = function (callback, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width];
      if (value != null) {
        //take a sec to talk about .call
        callback.call(context, value, new Vector(x, y));
      }
    }
  }
}

function View (world, vector) {
  this.world = world;
  this.vector = vector;
}
View.prototype.look = function (direction) {
  var target = this.vector.plus(directions[direction]);

  if (this.world.grid.isInside(target)) {
    return characterFromElement(this.world.grid.get(target));
  }

  return '#'
};
View.prototype.findAll = function (character) {
  var found = [];

  for (var direction in directions) {
    if (this.look(direction) == character) {
      found.push(direction);
    }
  }

  return found;
};
View.prototype.find = function (character) {
  var found = this.findAll(character);

  if (found.length == 0) {
    return null;
  }

  return randomElement(found);
};

function BouncingCritter () {
  this.direction = randomElement(directionNames);
}
BouncingCritter.prototype.act = function (view) {
  if (view.look(this.direction) != ' ') {
    this.direction = view.find(' ') || 'south';
  }

  return {
    type: 'move',
    direction: this.direction
  };

};

function WallFollower () {
  this.direction = 'south';
}
WallFollower.prototype.act = function (view) {
  var start = this.direction;
  if (view.look(directionPlus(this.direction, -3)) != ' ') {
    start = this.direction = directionPlus(this.direction, -2);
  }
  while (view.look(this.direction) != ' ') {
    this.direction = directionPlus(this.direction, 1);
    if (this.direction == start) break;
  }
  return { type: 'move', direction: this.direction };
};

function Wall () {}

var legend = {
  '#': Wall,
  '~': WallFollower,
  'o': BouncingCritter
};

//WORLD
function elementFromCharacter (legend, character) {
  if (character == ' ') {
    return null
  }

  var element = new legend[character]();

  element.originalCharacter = character;
  return element;
}

function characterFromElement (element) {
  if (element == null) {
    return ' ';
  }

  return element.originalCharacter;
}

function World (map, legend) {
  var grid = new Grid(map[0].length, map.length);

  this.grid = grid;
  this.legend = legend;

  map.forEach(function (line, y) {
    for (var x = 0; x < line.length; x++) {
      grid.set(new Vector(x, y), elementFromCharacter(legend, line[x]));
    }
  });
}
World.prototype.checkDestination = function (action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    var destination = vector.plus(directions[action.direction]);

    if (this.grid.isInside(destination)) {
      return destination;
    }
  }
};
World.prototype.letAct = function (critter, vector) {
  var action = critter.act(new View(this, vector));

  // this is defensive programming, explain why with burnItAllDown method
  if (action && action.type == 'move') {
    var destination = this.checkDestination(action, vector);

    if (destination && this.grid.get(destination) == null) {
      this.grid.set(vector, null);
      this.grid.set(destination, critter);
    }
  }
};
World.prototype.turn = function () {
  var acted = [];

  this.grid.forEach(function (critter, vector) {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
};
World.prototype.toString = function () {
  var output = '';

  for (var y = 0; y < this.grid.height; y++) {
    for (var x = 0; x < this.grid.width; x++) {
      var element = this.grid.get(new Vector(x, y));

      output += characterFromElement(element)
    }
    output += '\n';
  }
  return output;
}

//INSTANTIATE & ANIMATE
var plan = ["############################",
            "#~      #    #      o      ##",
            "#                          #",
            "#          #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];
var world = new World(plan, legend);
var pre = document.createElement('pre');
pre.id = 'container';
document.body.appendChild(pre);
var container = document.getElementById('container');

setInterval(function () {
  world.turn();
  container.innerHTML = world.toString();
}, 333);

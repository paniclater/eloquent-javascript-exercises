var plan = ["############################",
            "#      #    #      o      ##",
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
//PLAN
function Vector (x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function (other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

//GRID
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

//BOUNCING CRITTER
var directions = {
   'n': new Vector(0, -1),
  'ne': new Vector(1, -1),
   'e': new Vector(1, 0),
  'se': new Vector(1, 1),
   's': new Vector(0, 1),
  'sw': new Vector(-1, 1),
   'w': new Vector(-1, 0),
  'nw': new Vector(-1, -1)
};

function randomElement (array) {
  return array[Math.floor(Math.random() * array.length)];
}

var directionNames = Object.keys(directions);

function View (world, vector) {
  this.world = world;
  this.vector = vector;
}
View.prototype.look = function (direction) {
  var target = this.vector.plus(directions[dir]);

  if (this.world.grid.isInside(target)) {
    return characterFromElement(this.world.grid.get(target));
  }

  return '#'
};
View.prototype.findAll = function (character) {
  var found = [];

  for (var direction in directions) {
    if (this.look(direction) = character) {
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
    this.direction = view.find(' ') || 's';
  }
  return {
    type: 'move',
    direction: this.direction
  };
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

function Wall () {}

var legend = {
  '#': Wall,
  'o': BouncingCritter
};

//var world = new World(plan, legend)



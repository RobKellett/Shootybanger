function player(name, id, x, y) {
  this.name = name;
  this.id = id;
  this.position = {
    x: x,
    y: y
  };
  this.velocity = {
    x: 0,
    y: 0
  };
}
player.prototype.respond = function(evt) {
  if(evt.kind === 'key' && evt.sentBy === this.id) {
    if(evt.data.act === 'up') {
      this.velocity.x = 0;
    } else if(evt.data.key === 'left') {
      this.velocity.x = -1;
    } else if(evt.data.key === 'right') {
      this.velocity.x = 1;
    }
  }
};
player.prototype.physicsStep = function() {
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
};

module.exports = player;

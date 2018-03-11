function coopGame(){

$(document).ready(function () {

    $('.home').hide();
   
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
  
//window.screen.lockOrientationUniversal('portrait');
/*var rotate = 0 - window.orientation;
setAttribute("transform:rotate("+rotate+"deg);-ms-transform:rotate("+rotate+"deg);-webkit-transform:rotate("+rotate+"deg)", "style");*/
         
function preload() {

    game.load.image('yball', 'assets/images/yball.png');
    game.load.image('rball', 'assets/images/rball.png');
    game.load.image('bball', 'assets/images/bball.png');
    game.load.image('arrow', 'assets/images/arrow.png');
    game.load.audio('big', 'assets/audio/big.mp3');
    game.load.audio('medium', 'assets/audio/medium.mp3');
    game.load.audio('small', 'assets/audio/small.mp3');
    game.load.audio('pop', 'assets/audio/pop.mp3');
    
    
}
     
function create() {
    
    if (window.DeviceOrientationEvent){
		window.addEventListener("deviceorientation", function(event){
            console.log (Math.round(event.beta))
            y = (Math.round(event.beta))
            game.physics.p2.gravity.y = 10 * y
        }, true);
	} 
    
    if (window.DeviceOrientationEvent) {
  // Our browser supports DeviceOrientation
          console.log("browser does support Device Orientation");
    } else {
  console.log("Sorry, your browser doesn't support Device Orientation");
    }
    
    window.addEventListener("deviceorientation", this.handleOrientation, true);
    
    big = game.add.audio('big');
    medium = game.add.audio('medium');
    small = game.add.audio('small');
    pop = game.add.audio('pop', 0.5);
    
    big.allowMultiple = true;
    medium.allowMultiple = true;
    small.allowMultiple = true;

    game.physics.startSystem(Phaser.Physics.P2JS);
   
    //console.log (game.physics.p2.gravity.x)
    
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 0.8;
    
    var yballCollisionGroup = game.physics.p2.createCollisionGroup();
    var rballCollisionGroup = game.physics.p2.createCollisionGroup();
    var bballCollisionGroup = game.physics.p2.createCollisionGroup();
    var arrowCollisionGroup = game.physics.p2.createCollisionGroup();
    
    //  Some balls to collide with
    yballs = game.add.physicsGroup(Phaser.Physics.P2JS);
    rballs = game.add.physicsGroup(Phaser.Physics.P2JS);
    bballs = game.add.physicsGroup(Phaser.Physics.P2JS);
    arrows = game.add.physicsGroup(Phaser.Physics.P2JS);
    
    game.physics.p2.updateBoundsCollisionGroup();

    for (var i = 0; i < 2; i++)
    {
        var yball = yballs.create(game.world.randomX, game.world.randomY, 'yball');
        yball.body.setCircle(203);
        yball.scale.setTo(0.8, 0.8);
        yball.body.setCollisionGroup(yballCollisionGroup);
        yball.body.collides([yballCollisionGroup, rballCollisionGroup, bballCollisionGroup]);
        yball.inputEnabled = true;
        yball.events.onInputDown.add(popball, this);
       
    }
    
    for (var i = 0; i < 4; i++)
    {
        var rball = rballs.create(game.world.randomX, game.world.randomY, 'rball');
        rball.body.setCircle(128);
        rball.scale.setTo(0.5, 0.5);
        rball.body.setCollisionGroup(rballCollisionGroup);
        rball.body.collides([rballCollisionGroup, yballCollisionGroup, bballCollisionGroup]);
        rball.inputEnabled = true;
        rball.events.onInputDown.add(popball, this);
    }
    
    for (var i = 0; i < 6; i++)
    {
        var bball = bballs.create(game.world.randomX, game.world.randomY, 'bball');
        bball.body.setCircle(50);
        bball.scale.setTo(0.2, 0.2);
        bball.body.setCollisionGroup(bballCollisionGroup);
        bball.body.collides([bballCollisionGroup, yballCollisionGroup, rballCollisionGroup]);
        bball.inputEnabled = true;
        bball.events.onInputDown.add(popball, this);
    }
    
    bball.body.onBeginContact.add(bhit, this);
    
    function bhit (body, bodyB) {
        if (body){
        if (bball.body.velocity.x > 15 || bball.body.velocity.y > 15){
          small.play();
        }
    }
    }
    
    rball.body.onBeginContact.add(rhit, this);
    
    function rhit (body, bodyB) {
      if (body){
        if (rball.body.velocity.x > 15 || rball.body.velocity.y > 15){
          medium.play();
        }  
    }
    }
    
    yball.body.onBeginContact.add(yhit, this);
    
    function yhit (body, bodyB) {
       if (body){
        if (yball.body.velocity.x > 15 || yball.body.velocity.y > 15){
          big.play();
        }  
    }
    }
    
    function popball (balls) {
    balls.destroy(balls);
    pop.play();
    popCheck();    
    
} 
    
     function popCheck(){
         living = yballs.countLiving() + rballs.countLiving() + bballs.countLiving();
         if(living < 1 && y >= 0){
         
         var arrow = arrows.create(game.world.centerX, game.world.centerY, 'arrow');
         arrow.body.setCollisionGroup(arrowCollisionGroup);
         game.physics.p2.restitution = 1.1;
         arrow.body.fixedRotation = true;
         
         var t=setInterval(upCheck,1000);
         
         } else if (living < 1 && y <= 0){
        
         var arrow = arrows.create(game.world.centerX, game.world.centerY, 'arrow');
         arrow.body.setCollisionGroup(arrowCollisionGroup);
         arrow.angle = 180
         game.physics.p2.restitution = 1.1;
         arrow.body.fixedRotation = true;
         var t=setInterval(downCheck,1000); 
         
         }
     
         
         function upCheck(){
             console.log("Have I been flipped yet?")
             if (y < 0 ){
                 clearInterval(t);
                 arrow.destroy();
                 create();
                 console.log("Yes I have been flipped");
             } 
         }
         
         function downCheck(){
             console.log("Have I been flipped yet?")
             if (y > 0 ){
                 clearInterval(t);
                 arrow.destroy();
                 create();
                 console.log("Yes I have been flipped");
             } 
         }
     }
}
   
function render () {
    game.debug.body(yballs);
    game.debug.body(bballs);
    game.debug.body(rballs);
}

function update() {}
    

    
});

}
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var rabbit,fruit,backgroundImage,fruitImage;
var button;
var rope,bunny,rope2,rope3;
var fruitcon,fruitcon2,fruitcon3;
var blink,eat,sad;
var bg_sound,cut_sound,sad_sound,eating_sound,air_sound;
var air_blowerImg,air_blower;
var muteButton;
var button2,button3;
var canH,canW;

function preload(){
  rabbit = loadImage("Rabbit-01.png");
  fruitImage = loadImage("melon.png");
  backgroundImage = loadImage("background.png");
  air_blowerImg = loadImage("air_blower.png");

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  
  bg_sound = loadSound("sound1.mp3");
  cut_sound = loadSound("rope_cut.mp3");
  sad_sound = loadSound("sad.wav");
  eating_sound = loadSound("eating_sound.mp3");
  air_sound = loadSound("air.wav");

  blink.playing = true
  eat.playing = false
  sad.playing = true
  sad.looping = false
  eat.looping = false

}

function setup() 
{
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth+80,displayHeight);
  }
  else{
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(windowWidth,windowHeight);
  }

  frameRate(80);
  engine = Engine.create();
  world = engine.world;

  bg_sound.play();
  bg_sound.setVolume(0.1);

  ground = new Ground(200,canH,600,20);

  button = createImg("cut_button.png");
  button.position(200,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg("cut_button.png");
  button2.position(330,35);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  button3 = createImg("cut_button.png");
  button3.position(150,205);
  button3.size(50,50);
  button3.mouseClicked(drop3);

  muteButton = createImg("mute.png");
  muteButton.position(450,20);
  muteButton.size(50,50);
  muteButton.mouseClicked(mute);
  
  rope = new Rope(7,{x:220, y:30})
  rope2 = new Rope(7,{x:370, y:40});
  rope3 = new Rope(5,{x:150, y:205});

  bunny = createSprite(170,canH-80,100,100);
  bunny.addImage(rabbit);
  bunny.scale = 0.2;

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');

  fruit = Bodies.circle(300,300,20);

  Matter.Composite.add(rope.body,fruit);

  fruitcon = new Link(rope,fruit);
  fruitcon2 = new Link(rope2,fruit);
  fruitcon3 = new Link(rope3,fruit);

  air_blower = createImg("air_blower.png");
  air_blower.position(10,250);
  air_blower.size(150,100);
  air_blower.mouseClicked(airBlow);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  imageMode(CENTER);
}

function draw() 
{
  background(51);
  image(backgroundImage,0,0,displayWidth+1500,displayHeight+615);
  push();

  imageMode(CENTER);
  
  if(fruit!=null){
    image(fruitImage,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  rope.show()
  rope2.show()
  rope3.show()
  ground.show();
  Engine.update(engine);
  if(collide(fruit,bunny)==true)
  {
    bunny.changeAnimation('eating');
    console.log("eating");
    eating_sound.play();
  }

  if(fruit!=null&&fruit.position.y>=650)
  {
    console.log("crying");
    bunny.changeAnimation('crying');
    sad_sound.play();
  }
  drawSprites();
}

function drop(){
  rope.break();
  fruitcon.detach();
  fruitcon = null
  cut_sound.play();
}

function drop2(){
  rope2.break();
  fruitcon2.detach();
  fruitcon2 = null
  cut_sound.play();
}

function drop3(){
  rope3.break();
  fruitcon3.detach();
  fruitcon3 = null
  cut_sound.play();
}

function collide(body,sprite)
{
  if(body!=null){
    var d=dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if(d<=80){
      World.remove(engine.world,fruit)
      fruit=null;
      console.log("collide_true",body,sprite);
      return true;
    }
    else
    {
      console.log("collide_false");
      return false;
    }
  }
}

function airBlow()
{
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.03,y:0});
  air_sound.play();
}

function mute()
{
  if(bg_sound.isPlaying())
  {
    bg_sound.stop();
  }
  else
  {
    bg_sound.play();
  }
}
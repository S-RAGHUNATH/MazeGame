//Matter - global varaiable got from matter link.
const {Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse} = Matter; 

const width = 800;
const height = 600;

let engine =Engine.create();
//creating engine will create world so destructure it from engine
let {world} = engine;

//render obj to show content on screen
let render = Render.create({
    element: document.body,  //location to show
    engine: engine,
    options: {          //dimension of the element-canvas
        wireframes: false, //gives solid shape and random color
        width,  // this is equal to width:width
        height
    }
});
// running the Render and passing create obj 'render' into it
Render.run(render);
Runner.run(Runner.create(), engine);
//Mouse and MouseConstraint are destructured from 'Matter' which is used to move objects using mouse
let mouseConstraint = MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)  //canvas-the space where we do whole project i.e black box
});
World.add(world, mouseConstraint) //add it to the World object to show on screen

//create and add it to the World object to show on screen
//Walls
let walls = [ //order-top, bottom, left, right line
    Bodies.rectangle(400, 0, 800, 40, {isStatic: true}),  //isStatic: true -> not to move the shape
    Bodies.rectangle(400, 600, 800, 40, {isStatic: true}),
    Bodies.rectangle(0, 300, 40, 600, {isStatic: true}),  // rectangle(x, y, width, height, {})
    Bodies.rectangle(800, 300, 40, 600, {isStatic:true})
]
World.add(world, walls);   //check 'world' in console

//Random shapes
for(let i=0;i<20;i++){
    if(Math.random() > 0.5){
        World.add(world, Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50));
    }else{
        //for circle -> 3rd arg is radius
        World.add(world, Bodies.circle(Math.random() * width, Math.random() * height, 35, {
            render:{
                //fillStyle - to give a single color to the object
                fillStyle: 'red' //any valid css color can be given
            }
        }));
    }
     
}
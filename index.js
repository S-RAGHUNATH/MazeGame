//Matter - global varaiable got from matter link.
//de-structuring the reqd objects
const {Engine, Render, Runner, World, Bodies, Body, Events} = Matter; 

//number of cells(box) present 
//always cellsHorizontal shd be > cellsVertical
const cellsHorizontal = 25;  //for number of columns
const cellsVertical = 20;   //for number of rows

//giving square box value to make maze easily
const width = window.innerWidth;  //inbuit js prop - entire visible width area of browser
const height = window.innerHeight;

//Used to create walls in maze
const unitLengthX  = width/cellsHorizontal;   //length of horizontal side of a cell
const unitLengthY = height/cellsVertical;     //length of vertical side of a cell

let engine =Engine.create();
//disabling gravity for y axis
engine.world.gravity.y = 0 

//creating engine will create world so de-structure it from engine
let {world} = engine;

//render obj to show content on screen
let render = Render.create({
    element: document.body,  //location to show
    engine: engine,
    options: {          //dimension of the element-canvas
        wireframes: false, //gives solid shape and random color when false
        width,  // this is equal to width:width
        height
    }
});
// running the Render and passing create obj 'render' into it
Render.run(render);
Runner.run(Runner.create(), engine);

//create and add it to the World object to show on screen
//Walls
let walls = [
    //top line
    Bodies.rectangle(width/2, 0, width, 2, {isStatic: true}),  //isStatic: true -> not to move the shape
    //bottom line
    Bodies.rectangle(width/2, height, width, 2, {isStatic: true}),
    //left line
    Bodies.rectangle(0, height/2, 2, height, {isStatic: true}),  // rectangle(centre of x, centre of y, width, height, {})
    //right line
    Bodies.rectangle(width, height/2, 2, height, {isStatic:true})
]
World.add(world, walls);   //check 'world' in console

//**Maze Generation**

//for shuffling the order randomly
const shuffle = (arr) => {
    let counter = arr.length;
    while(counter > 0){
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
};

//GRID ARRAY
//grid array is to keep track of the cells visited .
// let grid = Array(3).fill(Array(3).fill(false)) ---> cant use this coz it shares same memory so use map method
let grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false))

/*>>>>>>>above code is equal to below<<<<<<<<<<<<*/
// let grid = []
// for(let i=0;i<3;i++){
//     grid.push([])
//     for(let j=0;j<3;j++){
//         grid[i].push(false)
//     }
// }

console.log(grid)

//HORIZONTAL ARRAY
let horizontal = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false))
console.log(horizontal)

//VERTICAL ARRAY
let vertical = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false))
console.log(vertical)

let startRow = Math.floor(Math.random() * cellsVertical)
let startColumn = Math.floor(Math.random() * cellsHorizontal)

const stepThroughCell = (row, column) => {

    //If the cell is already visited @ [row,column], then return
    if(grid[row][column]){
        return
    }

    //mark this cell as being visited
    grid[row][column] = true;

    //assemble randomly ordered list of neighbours >>> i.e these are the possible neighbours of current visiting cell
    let neighbours = shuffle([
        [row-1, column, 'up'], //3rd element used as a direcion flag
        [row+1, column, 'down'],
        [row, column-1, 'left'],
        [row, column+1, 'right']
    ]);
    //console.log(neighbours);

    //for each neighbour
    for(let neighbour of neighbours){
        [nextRow, nextColumn, direction] = neighbour

        //see if neighbour is out of bound
        if(nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal){
            continue; // to skip the current iteration and continue with the next
        }

        //if we have visited the neighbour, continue to next neighbor
        if(grid[nextRow][nextColumn]){
            continue;
        }

        //Remove a wall from either horizonts or verticals, depending on the direction of movement
        if(direction === 'left'){  //left and right involves vertical array
            vertical[row][column - 1] = true
        }else if(direction === 'right'){
            vertical[row][column] = true;
        }else if(direction === 'up'){ //left and right involves horizontal array
            horizontal[row - 1][column] = true;
        }else if(direction === 'down'){
            horizontal[row][column] = true;
        }
          //visit that next random cell
        stepThroughCell(nextRow, nextColumn)  //to continue the iteration

      

    }

}

stepThroughCell(startRow, startColumn)

//horizontal is 2 dimensional array so u receive inner array
//FOR EACH SYNTAX : array.forEach(function(currentValue, index, arr), thisValue)

horizontal.forEach((row, rowIndex) => {  //rowIndex says what row we r currently operating on
    row.forEach((open, columnIndex) => { //columnIndex says what column we r currently operating on
        if(open){
            return
        }
        //creating wall for element 'open' when value = false
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + (unitLengthX/2),  //formula that works
            rowIndex * unitLengthY + unitLengthY,       //formula that works
            unitLengthX, //width of rectangle
            10,      //test value
            {
                label: 'wall',  //this label to be used during collision
                isStatic: true,
                render: {
                    fillStyle: 'red'   // fillStyle prop is used to give color
                }
            }
        );
        World.add(world, wall);
    });
});

vertical.forEach((row, rowIndex)=>{
    row.forEach((open, columnIndex) => {
        if(open){
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY/2,
            10, //test value
            unitLengthY, //height of the rectangle
            {
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: 'red'
                }
            }
        );
        World.add(world, wall);
    });
});

//Goal - drawing it in last cell
const goal = Bodies.rectangle(
    width - unitLengthX/2,
    height - unitLengthY/2,
    unitLengthX * 0.7,  //0.6
    unitLengthY * 0.7,  //0.6
    {
        isStatic: true,
        label: 'goal',  //optional param used to give a unique label name
        render: {
            fillStyle: 'green'
        }
    }
    );
World.add(world, goal);

//Ball

let ballRadius = Math.min(unitLengthX, unitLengthY)/4
//centre of x, centre of y, radius of circle, optional param used to give a unique label name
const ball = Bodies.circle(unitLengthX/2, unitLengthY/2, ballRadius, {label : 'ball', render: {fillStyle: 'blue'}}); 
World.add(world, ball);

let {x ,y}= ball.velocity //Body(destructured from matter) contains diff properties such as 'velocoty' in a shape
document.addEventListener('keydown', (event) => {

   //  let {x ,y}= ball.velocity //Body(destructured from matter) contains diff properties such as 'velocoty' in a shape
    //using keycode property to identify the key pressed. 
    //keycode website - "keycode.info"
    if(event.keyCode === 38){   // up = w  87 
        Body.setVelocity(ball, {x : x, y : y - 5}) //syntax: Matter.Body.setVelocity(body, velocity)
    }
    if(event.keyCode === 40){   //   down= s 83
        Body.setVelocity(ball, {x : x, y : y + 5})
    }
    if(event.keyCode === 37){   // left = a  65
        Body.setVelocity(ball, {x : x - 5, y })
    }
    if(event.keyCode === 39){    //right = d  68
        Body.setVelocity(ball, {x : x + 5, y : y})
    }
   
})

//win condition

//Events - Events of the objects
Events.on(engine, 'collisionStart', (event)=>{
    event.pairs.forEach((collision)=>{
        let labels = ['ball', 'goal'];

        //bodyA and bodyB are properties that contain label we defined for ball and goal
        if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)){
            
            //to display the win text
            document.querySelector('.winner').classList.remove('hidden');

            engine.world.gravity.y = 1 //turning on the gravity once ball and goal collide
            world.bodies.forEach((body)=>{  //world.bodies is an array that contains prop of all bodies created
                if(body.label === 'wall'){
                    Body.setStatic(body, false) //to update static flag
                }
            })
        }
    })
})



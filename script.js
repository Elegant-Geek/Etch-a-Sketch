// NOTE: that below, I am only grabbing the gridbox and adding css styles to it from within using DOM, this main gridbox container itself is not added thru JS (it sits in HTML.) 
// The critical / primary styles however, ARE added via DOM / JS stuff! I chose to add the CSS styles in HERE so that the dimensions of the gridbox can remain more dynamic (500x500 for now.)
const gridbox = document.querySelector('.gridbox');
// setting up properties of the huge gridbox inside the DOM so that I can grab the width from within!!!!!
// NOTE: THIS is the line (gridbox.style.cssText) where you can change the width and height of the main gridbox container dynamically w/o it breaking anything else!
gridbox.style.cssText = "box-sizing: content-box; width: 500px; height: 500px; border: 1px solid black; display: flex; flex-wrap: wrap;"
// actually grabbing the css width property I set to the grid so that I can use it as a variable in case it ever changes!
// using regex variable to grab everything before 'px' in the width property!
const regex = /(.*)px/gm;
// creating the constant that holds the integer value of the css value of '500px' for instance (stores the integer value '500')
const gridboxWidth = parseInt(gridbox.style.width.match(regex));

// NOTE: THIS LINE (let userInput = 30;) IS THE ONLY LINE THE USER WILL BE ABLE TO CHANGE. This is the only variable the user will be able to change in the future!
// NOTE: DO NOT exceed 100 x 100 px grid please!!!!
let userInput = 30;
let squareUserInput = (userInput ** 2);
// this always calculates the exact pixels needed for the grid so that the only thing the user needs to change is the user input (ex: 16 x 16) dimension!
// NOTE: ALL other variables are related back / dependent on / tied to what the user sets as the input for the grid. Variables like smallGridWidth and 
// BELOW: is the calculation variable to obtain the grid square width based on the current large gridbox container width and height!!!
const smallGridWidth = (gridboxWidth / userInput);
// I am only using .toFixed(2) for display purposes in the console log! I do NOT want to round my actual variable down at all!

console.log(`The current dimension of the individual small grid square is ${smallGridWidth.toFixed(2)} x ${smallGridWidth.toFixed(2)} pixels.`);
console.log (`The main gridbox dimension is ${gridboxWidth} x ${gridboxWidth} px with a ${userInput} x ${userInput} px size grid within.`)


for (let i = 0; i < squareUserInput; i++) {
    if (userInput <= 100) {
        const smallGrid= document.createElement('div');
        // create a classname for each div
        smallGrid.className = 'mini-grid-square';
        // width and height is determined directly from the user's input of grid size!
        smallGrid.style.width = `${smallGridWidth}px`;
        // easily setting height below to match that width pixel dimension so that grid squares always come out uniform.
        smallGrid.style.height = smallGrid.style.width;
        // place div element inside #result div
        gridbox.appendChild(smallGrid);
    }
    else {
        console.log('PLEASE INSERT A GRID VALUE LESS THAN OR EQUAL TO 100 x 100 PIXELS!')
        //break allows you to only run this command once rather than a million times
        break;
    }

  }


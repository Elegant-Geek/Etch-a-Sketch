// NOTE: that below, I am only grabbing the gridbox and adding css styles to it from within using DOM, this main gridbox container itself is not added thru JS (it sits in HTML.) 
// The critical / primary styles however, ARE added via DOM / JS stuff! I chose to add the CSS styles in HERE so that the dimensions of the gridbox can remain more dynamic (500x500 for now.)
// assign the main gridbox div to a parent container reference for gridbox DOM children:
const gridbox = document.querySelector('.gridbox');
const gridboxWidth = 500;
// setting up properties of the huge gridbox inside the DOM so that I can grab the width from within!!!!!
// NOTE: THIS is the line (gridbox.style.cssText) where you can change the width and height of the main gridbox container dynamically w/o it breaking anything else!
// the constant of the gridbox width is placed inside the styling here after setting the constant (removed redundant regex pulling)
gridbox.style.cssText = `box-sizing: content-box; width: ${gridboxWidth}px; height: ${gridboxWidth}px; border: 1px solid black; display: flex; flex-wrap: wrap; user-select: none;`;

// this must be set to 16 to match the initial slider default position loaded in the browser.
let userInput = 16;
// NOTE: DO NOT exceed 60 x 60 px grid for simplicity:
let maxWidth = 60;
let userColor = 'black';
let defaultBackgroundColor = 'white';
let secondColorEnable = false;
let isDrawing = false;
// set up clear grid button, size label, and slider:
const sizeValue = document.getElementById('grid-size-label');
const gridSlider = document.getElementById('grid-size-slider');
const clearGridButton = document.getElementById('clear-grid-btn');
// add the event listener (clears grid when button is clicked)
clearGridButton.addEventListener("click", clearGrid);
function clearGrid() {
    // reset bg color back to white for all little grid divs
    // smallGrid.style.backgroundColor = `${defaultBackgroundColor}`;
    gridbox.innerHTML='';
    // load the grid with the currently configured user input
    loadGrid(userInput);
  }

// from https://github.com/michalosman for changing slider value: 
gridSlider.onchange = (e) => changeSize(e.target.value);
function changeSize(value) {
    // update with correct user value from the slider!
    userInput = value;
    // update slider display text instantly:
    sizeValue.innerHTML = `${value} x ${value}`;
    // clear grid will make it blank then load in the grid with the new user input!
    clearGrid();
    }

const eraserButton = document.getElementById('eraser-btn');
// add the event listener (clears grid when button is clicked)
eraserButton.addEventListener("click", toggleBackgroundColor);
function toggleBackgroundColor() {
    if (secondColorEnable === false) {
        secondColorEnable = true;
        eraserButton.style.cssText = 'background-color: rgb(116, 116, 221)';
        eraserButton.innerHTML = 'Get Pen';
        userColor = defaultBackgroundColor;
    }
    
    else if (secondColorEnable === true) {
        secondColorEnable = false;
        eraserButton.style.cssText = 'background-color: aquamarine';
        eraserButton.innerHTML = 'Get Eraser';
        //change later to match color
        userColor = 'black';
    }

  }

function loadGrid(userInput) {
    // When grid size is changed or cleared, this function runs again. Toggle pen back to default! Always start a fresh canvas with pen selected.
    if (secondColorEnable === true) {toggleBackgroundColor();}
    // BObtain the grid square width based on the current large gridbox container width and height:
    const smallGridWidth = (gridboxWidth / userInput);
    // I am only using .toFixed(2) for display purposes in the console log! I do NOT want to round my actual variable down at all!
    console.log(`The current dimension of the individual small grid square is ${smallGridWidth.toFixed(2)} x ${smallGridWidth.toFixed(2)} pixels.`);
    console.log (`The main gridbox dimension is ${gridboxWidth} x ${gridboxWidth} px with a ${userInput} x ${userInput} px size grid within.`)
    for (let i = 0; i < userInput ** 2; i++) {
        if (userInput <= maxWidth) {
            // this always calculates the exact pixels needed for the grid so that the only thing the user needs to change is the user slider input (ex: 16 x 16) dimension!
            // NOTE: ALL other variables are related back / dependent on / tied to what the user sets as the input for the grid. 
            const smallGrid= document.createElement('div');
            // create a classname for each div
            smallGrid.className = 'mini-grid-square';
            // width and height is determined directly from the user's input of grid size!
            smallGrid.style.cssText = `width: ${smallGridWidth}px; height: ${smallGridWidth}px; background-color: ${defaultBackgroundColor};`
            // place div element inside #result divs
            gridbox.appendChild(smallGrid);
            
            // defining the function that occurs when hover is selected
            function pickColor(event) {
                smallGrid.style.backgroundColor = `${userColor}`;
            }

            smallGrid.addEventListener(
                'mousedown', () => isDrawing = true);
              
            smallGrid.addEventListener('mousemove', (event) => {
               if (isDrawing === true) {
                pickColor(event);
            }
              });
              
            smallGrid.addEventListener(
                'mouseup', () => isDrawing = false);
        }

        else {
            console.log(`Grid dimensions must be less than ${maxWidth} x ${maxWidth} pixels.`)
            //break allows you to only run this command once rather than a million times
            break;
        }
      }

}

// tells browser what to run on refresh
window.onload = () => {
    loadGrid(userInput);
  }


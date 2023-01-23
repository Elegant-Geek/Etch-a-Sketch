// NOTE: I am only grabbing the gridbox and adding css styles to it from within using DOM, this main gridbox container sits in HTML and is used as a reference.
// Use the large main gridbox div as a reference container for the grid's several DOM children:
const gridbox = document.querySelector('.gridbox');
// I chose to add the main gridbox dimensions in HERE so it can remain more dynamic (You get to set the main gridbox width on line 5).
const gridboxWidth = 500;
// Setting up several properties of the huge gridbox inside the DOM:
// Now the dynamic gridbox dimensions get updated on the fly!
gridbox.style.cssText = `box-sizing: content-box; width: ${gridboxWidth}px; height: ${gridboxWidth}px; border: 1px solid black; display: flex; flex-wrap: wrap; user-select: none;`;

// NOTE: userInput must be set to 16 to match the initial slider default position loaded in the browser.
let userInput = 16;
// NOTE: DO NOT exceed 60 x 60 px grid for simplicity. (The range slider in HTML is also set to 60 x 60 px maximum grid)
let maxWidth = 60;
let defaultPenColor = 'black';
let defaultBackgroundColor = 'white';
// By default on first load, eraser is not selected 
let secondColorEnable = false;
let isDrawing = false;
// Set up clear grid button, size label, and slider: (use LET not CONST for the changing values)
let sizeValue = document.getElementById('grid-size-label');
let gridSlider = document.getElementById('grid-size-slider');
const clearGridButton = document.getElementById('clear-grid-btn');
const eraserButton = document.getElementById('eraser-btn');
// LET, not CONST for smallgridwidth because this dimension changes whenever the user input is altered with the grid sizing slider!
let smallGridWidth = (gridboxWidth / userInput);

// Add the event listener (clears grid when button is clicked)
clearGridButton.addEventListener("click", clearGrid);

function clearGrid() {
    // Clears all child little grid divs
    gridbox.innerHTML='';
    //Grab pen color. This function also resets the eraser back to pen on anytime you run it
    changePenColor(); 
    // load the grid with the currently configured user input like pen color and currently selected bg color
    loadGrid(userInput);
}

// Credit to https://github.com/michalosman for changing slider value (line 37): 
gridSlider.onchange = (e) => changeSize(e.target.value);

function changeSize(value) {
    // update with correct user value from the slider!
    userInput = value;
    // every time the grid size updates, the gridbox width MUST be re-defined! 
    smallGridWidth = (gridboxWidth / userInput);
    // update slider display text instantly:
    sizeValue.innerHTML = `${value} x ${value}`;
    // clear grid will make it blank then load in the grid with the new user input!
    clearGrid();
}

// add the event listener (clears grid when button is clicked)
eraserButton.addEventListener("click", toggleEraser);

function toggleEraser() {
    if (secondColorEnable === false) {
        secondColorEnable = true;
        eraserButton.style.cssText = 'background-color: #7474DD';
        eraserButton.innerHTML = 'Get Pen';
        defaultPenColor = defaultBackgroundColor;
    }
    
    else if (secondColorEnable === true) {
        secondColorEnable = false;
        // If you change the background color and then hit this toggle button back again, you must GRAB THE PEN COLOR again.
        // I already implemented the change pen color option in the cleargrid thing and toggled back to pen, but not here
        changePenColor();
        eraserButton.style.cssText = 'background-color: #9795f9';
        eraserButton.innerHTML = 'Get Eraser';
    }
}

function changePenColor() {
    // runs whenever the pen color input value (onchange listener added to the HTML element) is altered.
    defaultPenColor = document.querySelector('.pen-color').value;
    // BONUS FEATURE: whenever you select a new pen color while on the eraser mode (second color enable true), the tool reverts back to the pen not the eraser!
    if (secondColorEnable === true) {
        //turn off eraser if it is on while you pick a new color!
        toggleEraser();
    }
}

function changeBackgroundColor() {
// grab all the small divs (that have both classes aka the ones that don't have pen ink)!!!!!!
    const backgroundColorDivs = document.querySelectorAll('.bg-color-select.mini-grid-square');
    // console log below displays how many of those divs are NOT penned in / drawn on
    // console.log(backgroundColorDivs.length);
    // set new value using the color input
    defaultBackgroundColor = document.querySelector('.bg-color').value;
    // add style element to only those affected divs (not the pen ones!)
    // this had an issue before only because I never set the correct height and width attributes outside of the load grid function (oops!)
    backgroundColorDivs.forEach(element => element.style.cssText = `width: ${smallGridWidth}px; height: ${smallGridWidth}px; background-color: ${defaultBackgroundColor};`
    );
}
      
function loadGrid(userInput) {
    // When grid size is changed or cleared, this function runs again. Toggle pen back to default! Always start a fresh canvas with pen selected.
    // Obtain the grid square width based on the current large gridbox container width and height: (smallgridwidth gets recalculated every time the grid gets resized...
    // so that when cleargrid or loadgrid is called, smallgridwidth is already calculated thanks to the .onchange grid slider function)
    // smallGridWidth = (gridboxWidth / userInput);
    // I am only using .toFixed(2) for display purposes in the console log! I do NOT want to round my actual variable down at all!
    console.log(`The current dimension of the individual small grid square is ${smallGridWidth.toFixed(2)} x ${smallGridWidth.toFixed(2)} pixels.`);
    console.log (`The main gridbox dimension is ${gridboxWidth} x ${gridboxWidth} px with a ${userInput} x ${userInput} px size grid within.`)
    for (let i = 0; i < userInput ** 2; i++) {
        if (userInput <= maxWidth) {
            // this always calculates the exact pixels needed for the grid so that the only thing the user needs to change is the user slider input (ex: 16 x 16) dimension!
            // NOTE: ALL other variables are related back / dependent on / tied to what the user sets as the input for the grid. 
            const smallGrid= document.createElement('div');
            // create a classname for each div
            smallGrid.className = 'mini-grid-square bg-color-select';
            // gives me access to all inner smallgrid boxes as long as they have that bg-color-select class on them!
            // smallGrid.classList.toggle('bg-color-select');
            // width and height is determined directly from the user's input of grid size!
            smallGrid.style.cssText = `width: ${smallGridWidth}px; height: ${smallGridWidth}px; background-color: ${defaultBackgroundColor};`
            // place div element inside #result divs
            gridbox.appendChild(smallGrid);

            // defining the function that occurs when hover is selected
            function pickColor(event) {
                // whenever pen tool is used, the 'yes this is a bg color square' identifier is removed. (square is no longer a bg color div)
                // NOTE: that whenever the grid is reloaded, all divs get the 'bg-color-select' class added back in.

                // if the eraser is selected, the divs that are moused over RETAIN the bg-color-select so that background color changes include these squares!
                if (secondColorEnable === true) {
                    smallGrid.classList.add('bg-color-select');
                    // this sets the grid square color to match the user inputted background color (secondary color) chosen for the grid.
                    smallGrid.style.backgroundColor = `${defaultBackgroundColor}`;
                }
                // if the eraser is NOT selected, the divs that are moused over LOSE the bg-color-select so that background color changes include these squares!
                else {
                // Adjusted the line below from 'toggle' to removing the class! Otherwise, re-drawing over the same area adds the background color (refill) back in when bg color changes! Bad!
                smallGrid.classList.remove('bg-color-select');
                // this line looks like a a typo, but it is NOT! It sets the mini grid square color to match the pen color chosen.
                smallGrid.style.backgroundColor = `${defaultPenColor}`;
                }
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


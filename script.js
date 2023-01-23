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
    // Grab pen color. This function also resets the eraser back to pen on anytime you run it
    changePenColor(); 
    // Load the grid with the currently configured user input like pen color and currently selected bg color
    loadGrid(userInput);
}

// Credit to https://github.com/michalosman for changing slider value (line 37): 
gridSlider.onchange = (e) => changeSize(e.target.value);

function changeSize(value) {
    // Update with correct user value from the slider!
    userInput = value;
    // Every time the grid size updates, the gridbox width MUST be re-defined! 
    smallGridWidth = (gridboxWidth / userInput);
    // Update slider display text instantly:
    sizeValue.innerHTML = `${value} x ${value}`;
    // Clear grid will make it blank then load in the grid with the new user input!
    clearGrid();
}

// Add the event listener (clears grid when button is clicked)
eraserButton.addEventListener("click", toggleEraser);

function toggleEraser() {
    if (secondColorEnable === false) {
        secondColorEnable = true;
        eraserButton.style.cssText = 'background-color: #7474DD';
        eraserButton.innerHTML = 'Get Pen';
        defaultPenColor = defaultBackgroundColor;
    }
    
    else if (secondColorEnable === true) {
        // 'get pen' is currently displayed onscreen before this runs. 
        // If eraser is on (secondColorEnable === true), it gets turned off then the program gets updated with whatever the current pen color is (line 70)
        secondColorEnable = false;
        // If user changes background color and then hit this toggle button back again, you continue to work on the eraser (good) but must have the program immediately capture the color of the pen.
        // I already implemented changePenColor() in the cleargrid thing (which) toggles you back to pen if on eraser), and also did it here! Line 70.
        changePenColor();
        eraserButton.style.cssText = 'background-color: #9795f9';
        eraserButton.innerHTML = 'Get Eraser';
    }
}

function changePenColor() {
    // Runs whenever the pen color input value (onchange listener added to the HTML element) is altered.
    // Set new value to the DOM pen-color's current value.
    defaultPenColor = document.querySelector('.pen-color').value;
    if (secondColorEnable === true) {
        // After you pick a new color, turn off the eraser if it is currently on (secondColorEnable === true).
        // NOTE: whenever you select a new pen color while on the eraser mode (second color enable true), the tool reverts back to the pen not the eraser!
        toggleEraser();
    }
}

function changeBackgroundColor() {
// Grab all the small divs (that have both classes aka the ones that don't have pen ink)!
    const backgroundColorDivs = document.querySelectorAll('.bg-color-select.mini-grid-square');
    // console log below displays how many of those divs are NOT penned in / drawn on
    // console.log(backgroundColorDivs.length);
    // Set new value to the DOM bg-color's current value.
    defaultBackgroundColor = document.querySelector('.bg-color').value;
    // Add style element to only those affected divs (not the pen ones!)
    // This had an issue before only because I never set the correct height and width attributes outside of the load grid function (oops! I have added them here.)
    backgroundColorDivs.forEach(element => element.style.cssText = `width: ${smallGridWidth}px; height: ${smallGridWidth}px; background-color: ${defaultBackgroundColor};`
    );
}
      
function loadGrid(userInput) {
    // When grid size is changed or cleared, this function runs again. Always start a fresh canvas with pen selected. 
    // (Pen gets toggled back to default in the changepencolor function inside of cleargrid function before loadgrid is called.)
    // Obtain the grid square width based on the current large gridbox container width and height. The smallgridwidth gets recalculated... 
    // Every time the grid gets resized thanks to the changeSize() function)
    // I am only using .toFixed(2) for display purposes in the console log! I do NOT want to round my actual variable down at all!
    console.log(`Each grid square is ${smallGridWidth.toFixed(2)} x ${smallGridWidth.toFixed(2)} px.`);
    console.log (`The main gridbox (${gridboxWidth} x ${gridboxWidth} px) contains a ${userInput} x ${userInput} px grid within.`)
    for (let i = 0; i < userInput ** 2; i++) {
        if (userInput <= maxWidth) {
            const smallGrid= document.createElement('div');
            // Create a classname for each div (multiple classnames are separated by a space)
            smallGrid.className = 'mini-grid-square bg-color-select';
            // Gives me access to all inner smallgrid boxes from outside this function as long as they have that bg-color-select class on them! COOL.
            // The dimensions of the smaller grid squares is determined directly from the user's input of grid size and nothing else!
            smallGrid.style.cssText = `width: ${smallGridWidth}px; height: ${smallGridWidth}px; background-color: ${defaultBackgroundColor};`
            // Place div element inside #result divs
            gridbox.appendChild(smallGrid);
            // This function is called during a click and drag!
            function pickColor(event) {
                // NOTE: whenever pen tool is used, the 'yes this is a bg color square' class (bg-color-select) is removed. (The square is no longer a bg-color-select div)
                // NOTE: that whenever the grid is reloaded, all divs get the 'bg-color-select' class added back in.

                // If the eraser is selected, the divs that are moused over RETAIN the bg-color-select so that background color changes include these squares!
                if (secondColorEnable === true) {
                    smallGrid.classList.add('bg-color-select');
                    // This sets the grid square color to match the user inputted background color (secondary color) chosen for the grid.
                    smallGrid.style.backgroundColor = `${defaultBackgroundColor}`;
                }
                // If the eraser is NOT selected, the divs that are moused over LOSE the bg-color-select so that background color changes include these squares!
                else {
                // The line below must be REMOVE not 'toggle' to remove the class once! Otherwise with toggle, re-drawing over the same area reassigns/adds the bg-color-select div which fills in these pen squares when background color changes! Bad!
                smallGrid.classList.remove('bg-color-select');
                // This line is NOT a typo! It sets the mini grid square color to match the pen color chosen.
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
            // Break allows you to only run this command once rather than a million times
            break;
        }
      }
    

}

// Tells browser what to run on launch / refreshes.
window.onload = () => {
    loadGrid(userInput);
  }

  // NOTE: Any commits past this point are commented code updates ONLY. If any bugs, compare this commit to the code structure of older commits that do not contain this message.
  // Etch a Sketch: Thursday - Sunday (Ended Mon morning at 12:30AM).

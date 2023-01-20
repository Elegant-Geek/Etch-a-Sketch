const mainContainer = document.querySelector('.gridbox');
// create empty p tag to display result of round


let i = 0;
let userInput = 16;
let squareUserInput = (userInput ** 2);


for (let i = 0; i < squareUserInput; i++) {
    const gridTest= document.createElement('div');

    // create a classname for each div
    gridTest.className = 'mini-grid-square';
    // default text for this div when page loads up
    // place div element inside #result div
    mainContainer.appendChild(gridTest);
  }


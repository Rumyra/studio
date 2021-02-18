import tinycolor from './tinyCol.js';

console.clear();

console.log('%cHiya! 👋 Thanks for taking a look at my codes 😎 Follow me on twitter or instagram to see more of my work; I\'m @Rumyra 🐧', 'background-color: hsla(315, 3%, 25%, 1); font-size: 120%; line-height: 1.4; text-align: center; color: hsla(33, 55%, 92%, 1); border: 2px solid hsla(273, 36%, 64%, 1); padding: 0.5em;');

// set up canvas, context and sizes
const container = document.querySelector('#gradients');
const canvasEl = container.querySelector('canvas');
const dpr = window.devicePixelRatio;
// TODO add window resize
const w = canvasEl.getBoundingClientRect().width * dpr;
const h = canvasEl.getBoundingClientRect().height * dpr;

canvasEl.width = w;
canvasEl.height = h;

const ctx = canvasEl.getContext("2d");

// 5 cols across, 4 rows down
const cw = w/5;
const ch = h/4;

// for the copy to clipboard
let copyHSL = '';

// generate some colours
function generateCols() {
  const colTL = tinycolor.random();
  const colTR = tinycolor.random();
  const colBL = tinycolor.random();
  const colBR = tinycolor.random();

  const rects = [];

  // counting up in x & y indexes
  for (let yi = 0; yi < 4; yi++) {

    let colY = tinycolor.mix(colTL, colBR, yi*33.3);

    for (let xi = 0; xi < 5; xi++) {
      // xi, yi, x, y, colour

      let colX = tinycolor.mix(colBL, colTR, xi*25);

      let col = tinycolor.mix(colY, colX, (xi+yi)*12.5);

      let x = xi*cw;
      let y = yi*ch;
      rects.push({xi: xi, yi: yi, x: x, y: y, col: col.toHslString()})
    }
  }

  rects.forEach( (el, i) => {
    ctx.fillStyle = el.col;
    ctx.fillRect(el.x, el.y, cw, ch);

    copyHSL += el.col+"\n";
  })
}
generateCols();

// yeh I know, bite me
const buttons = container.querySelectorAll('button');

// generate button
buttons[0].addEventListener('click', function() {generateCols();}, false);

// copy button
buttons[1].addEventListener('click', function() {
  navigator.clipboard.writeText(copyHSL).then(function() {buttons[1].innerText = 'Cool'},
    function() {buttons[1].innerText = 'Not Cool'})
}, false);
console.log(copyHSL);

// generate png
const dlLink = container.querySelector('a');

const callback = function (blob) {
  const url = window.URL.createObjectURL(blob);
  dlLink.href = url;
}

canvasEl.toBlob(callback);






import Color from "https://colorjs.io/dist/color.esm.js";

// TODO add window resize
// TODO update download on regeneration

console.clear();

console.log('%cHiya! 👋 Thanks for taking a look at my codes 😎 Follow me on twitter or instagram to see more of my work; I\'m @Rumyra 🐧', 'background-color: hsla(315, 3%, 25%, 1); font-size: 120%; line-height: 1.4; text-align: center; color: hsla(33, 55%, 92%, 1); border: 2px solid hsla(273, 36%, 64%, 1); padding: 0.5em;');

// randomInt to help with random col generation
function randomInt(min, max) {
  min = Math.floor(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// set up canvas, context and sizes
const container = document.querySelector('#gradients');
const canvasEl = container.querySelector('canvas');
const dpr = window.devicePixelRatio;
const w = canvasEl.getBoundingClientRect().width * dpr;
const h = canvasEl.getBoundingClientRect().height * dpr;

canvasEl.width = w;
canvasEl.height = h;

const ctx = canvasEl.getContext("2d");

// 5 cols across, 4 rows down
const cols = 8;
const rows = 5;
const cw = w/cols;
const ch = h/rows;

// for the copy to clipboard
let copyHSL = '';

// generate some colours
function generateCols() {

  const colTL = new Color("lab", [randomInt(0, 100), randomInt(-100, 100), randomInt(-100, 100)]);
  const colTR = new Color("lab", [randomInt(0, 100), randomInt(-100, 100), randomInt(-100, 100)]);
  const colBL = new Color("lab", [randomInt(0, 100), randomInt(-100, 100), randomInt(-100, 100)]);
  const colBR = new Color("lab", [randomInt(0, 100), randomInt(-100, 100), randomInt(-100, 100)]);

  // const leftGrad = colTL.steps(colBL, {space: "lab", steps: rows});
  // const rightGrad = colTR.steps(colBR, {space: "lab", steps: rows});

  const rects = [];

  // counting up in x & y indexes
  for (let yi = 0; yi < rows; yi++) {

    let colY = colTL.mix(colBR, (1/rows)*yi, {space: "lab"});
    // let col1 = leftGrad[yi];
    // let col2 = rightGrad[yi];
    // let grad = col1.steps(col2, {space: "lab", steps: cols, outputSpace: "hsl"});

    for (let xi = 0; xi < cols; xi++) {
      let colX = colBL.mix(colTR, (1/cols)*xi, {space: "lab"});
      let col = colY.mix(colX, 0.5, {space: "lab", outputSpace: "hsl"});
      // let col = grad[xi];
      // col = `hsl(${col.coords[0]*360}, ${col.coords[1]*100}%, ${col.coords[2]*100}%)`
      col = `hsl(${col.coords[0]}, ${col.coords[1]}%, ${col.coords[2]}%)`
      console.log(col);


      let x = xi*cw;
      let y = yi*ch;
      rects.push({xi: xi, yi: yi, x: x, y: y, col: col})
    }
  }

  rects.forEach( (el, i) => {
    ctx.fillStyle = el.col;
    ctx.fillRect(el.x, el.y, cw, ch);

    copyHSL += el.col+"\n";
  })
}
generateCols();

// generate png
const dlLink = container.querySelector('a');

const callback = function (blob) {
  const url = window.URL.createObjectURL(blob);
  dlLink.href = url;
}
canvasEl.toBlob(callback);

// yeh I know, bite me
const buttons = container.querySelectorAll('button');

// generate button
buttons[0].addEventListener('click', function() {
  generateCols();
  canvasEl.toBlob(callback);
}, false);

// copy button
buttons[1].addEventListener('click', function() {
  navigator.clipboard.writeText(copyHSL).then(function() {buttons[1].innerText = 'Cool'},
    function() {buttons[1].innerText = 'Not Cool'})
}, false);
console.log(copyHSL);








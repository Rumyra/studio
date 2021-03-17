console.clear();

console.log('%cHiya! 👋 Thanks for taking a look at my codes 😎 Follow me on twitter or instagram to see more of my work; I\'m @Rumyra 🐧', 'background-color: hsla(315, 3%, 25%, 1); font-size: 120%; line-height: 1.4; text-align: center; color: hsla(33, 55%, 92%, 1); border: 2px solid hsla(273, 36%, 64%, 1); padding: 0.5em;');

let actx = new AudioContext();
let oscNode;

// this gets mutated later to return actual params on osc, not just values
let params = {
  freq: 440,
  wave: 1, // 0: tri, 1: pulse, 2: saw, 3: sine, 4: noise
  phase: 0, // offset
  sync: 0, // hard sync freq
  duty: 0.5 // 0-1 pulse only duty
}

// actually better to have a setup/create node function rather than put it in play
// then possibly a modify for the params??

// init
async function init() {

  // add worklet
  await actx.audioWorklet.addModule('betterosc.js');

  // create new oscillator node
  oscNode = await new AudioWorkletNode(actx, 'better-oscillator');

  // get params and modify previously declared object to hold them
  // frequency
  params.freq = oscNode.parameters.get("frequency");
  // wave
  params.wave = oscNode.parameters.get("wave");
  // phase
  params.phase = oscNode.parameters.get("phase");
  // hard sync
  params.sync = oscNode.parameters.get("sync");
  // duty
  params.duty = oscNode.parameters.get("duty");
}
init();
// functions to call on interaction
// update
function update(param, value) {
  params[param].setValueAtTime(value, actx.currentTime);
}
// play
function play() {
  oscNode.connect(actx.destination);
}
// stop
function stop() {
  oscNode.disconnect();
}

// input change events
// quick & dirty: grab our buttons (wave type)
const buttons = document.querySelectorAll('.select--btns button');
// set wave param
buttons.forEach( (butt, i) => {
  butt.addEventListener('click', () => {
    
    // change the current button state
    const lastButt = document.querySelector('button[data-selected="true"]');
    lastButt.dataset.selected = 'false';
    // switch to our new button
    butt.dataset.selected = 'true';
    
    // update audio graph
    update('wave', Number(butt.dataset.type));
  })
} )

// grab out inputs
const inputs = document.querySelectorAll('div input');
inputs.forEach( (inp, i) => {
  inp.addEventListener('input', () => {
    update(inp.name, Number(inp.value));
  })
})


// play/pause functionality
const playButton = document.querySelector('#play-button');
playButton.addEventListener('click', function() {

  // check if context is in suspended state (autoplay policy)
  if (actx.state === 'suspended') {
      actx.resume();
  }

  // play or pause track depending on state
  if (this.dataset.playing === 'false') {
    play();
    this.dataset.playing = 'true';
    this.innerText = 'Pause';
  } else if (this.dataset.playing === 'true') {
    stop();
    this.dataset.playing = 'false';
    this.innerText = 'Play';
  }

}, false);




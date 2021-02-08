import irFiles from './encoded.js'

console.clear();

console.log('%cHiya! 👋 Thanks for taking a look at my codes 😎 Follow me on twitter or instagram to see more of my work; I\'m @Rumyra 🐧', 'background-color: hsla(315, 3%, 25%, 1); font-size: 120%; line-height: 1.4; text-align: center; color: hsla(33, 55%, 92%, 1); border: 2px solid hsla(273, 36%, 64%, 1); padding: 0.5em;');

// create an audio element to add the reverb to
const audioEl = new Audio('110_E_Arps_SP_01.mp3');
audioEl.crossOrigin = 'anonymous';


// instigate audio context
const actx = new AudioContext();
const source = actx.createMediaElementSource(audioEl);

// create our convolver node
const reverbNode = new ConvolverNode(actx);

// select the correct file
// the value of the radio input is the property of the imported object

let useFile = irFiles.bigHall1;

// using a base64 encoded file as a convolver inspired by this pen https://codepen.io/DonKarlssonSan/pen/doVKRE?editors=0010
// function to return a buffer from the base64
function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++)        {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// create a function to switch node buffer

// Convert it to a binary array first
var reverbSoundArrayBuffer = base64ToArrayBuffer(useFile);

actx.decodeAudioData(reverbSoundArrayBuffer, 
  function(buffer) {
    reverbNode.buffer = buffer;
  },
  function(e) {
    alert("Error when decoding audio data" + e.err);
  }
);

// connect our graph
source.connect(reverbNode).connect(actx.destination);

// pick up button and add play/pause functionality
const playButton = document.querySelector('button');
playButton.addEventListener('click', function() {

  // check if context is in suspended state (autoplay policy)
  if (actx.state === 'suspended') {
      actx.resume();
  }

  // play or pause track depending on state
  if (this.dataset.playing === 'false') {
    audioEl.play();
    this.dataset.playing = 'true';
    this.innerText = 'Pause';
  } else if (this.dataset.playing === 'true') {
    audioEl.pause();
    this.dataset.playing = 'false';
    this.innerText = 'Play';
  }

}, false);

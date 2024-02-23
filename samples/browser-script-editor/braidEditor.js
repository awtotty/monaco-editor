// Experiment: Braid-inspired state encoding for monaco editor 
// first attempt: just store everything every frame

// @TODO: abstract the model state as a state machine
let frames = [];
let currentFrame = -1;
let stackHead = -1;
let isSeeking = false;

// util
const simpleFramesLog = (frames) => {
  console.log('Simple Frames Log');
  frames.forEach((frame, index) => {
    console.log('Frame', index, ':', '\n' + frame);
  });
  console.log('Current Frame:', currentFrame);
  console.log('Stack head:', stackHead);
}

var editor = monaco.editor.create(document.getElementById('container'), {
  value: ['def hi():', '\tprint("hi")', 'hi()'].join('\n'),
  language: 'python'
});
var model = editor.getModel();

// @TODO this push should be a function
currentFrame += 1;
frames[currentFrame] = model.getValue();
stackHead += 1;

simpleFramesLog(frames);

// Listen to model content changes
model.onDidChangeContent((event) => {
  if (isSeeking) { return; }
  else if (currentFrame > stackHead) {
    console.error('You broke time. currentFrame > maxFrame:', currentFrame, '>', stackHead);
    currentFrame = stackHead;
    return;
  }
  else if (currentFrame >= frames.length) {
    console.error('Invalid frame index:', currentFrame);
    currentFrame = frames.length - 1;
    return;
  }
  else if (currentFrame < 0) {
    console.error('Invalid frame index:', currentFrame);
    currentFrame = 0;
    return;
  }

  // @TODO: here is that same push that should be a function as above
  // to get here, you had to have done rewind then typed again 
  // so we need to overwrite the future with a new reality
  currentFrame += 1;
  frames[currentFrame] = model.getValue();
  stackHead = currentFrame;

  // console.log('Model content changed:', event);
  // console.log('Model content:', model.getValue());
  simpleFramesLog(frames);
});

const seek = (frame) => {
  isSeeking = true;
  if (frame < 0 || frame >= frames.length) {
    console.error('Invalid frame index:', frame);
    isSeeking = false;
    return;
  }
  if (frame === currentFrame) {
    console.log('Already at frame:', frame);
    isSeeking = false;
    return;
  }
  if (frame > stackHead) {
    console.error('You broke time. frame > maxFrame:', frame, '>', stackHead);
    isSeeking = false;
    return;
  }
  model.setValue(frames[frame]);
  currentFrame = frame;
  simpleFramesLog(frames);
  isSeeking = false;
}

const inc = () => {
  console.log('Seeking to next frame');
  seek(currentFrame + 1);
}

const dec = () => {
  console.log('Seeking to previous frame');
  seek(currentFrame - 1);
} 

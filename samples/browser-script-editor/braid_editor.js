
var editor = monaco.editor.create(document.getElementById('container'), {
  value: ['def hi():', '\tprint("hi")', 'hi()'].join('\n'),
  language: 'python'
});

// Access the model from the editor
var model = editor.getModel();

// Listen to model content changes
model.onDidChangeContent((event) => {
  console.log('Model content changed:', event);
  // You can process the event here to get more details about the change
  console.log('Model content:', model.getValue());
});

const baseFrameRate = 5; 

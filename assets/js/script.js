const canvas = new fabric.Canvas('editor-canvas');
const undoStack = [];
const redoStack = [];
let selectedText = null;
var currentTextObject = null;

canvas.on('object:modified', saveState);
canvas.on('object:added', saveState);

function saveState() {
  redoStack.length = 0; 
  undoStack.push(canvas.toJSON());
}
//undo/redo
function undo() {
  if (undoStack.length > 0) {
    redoStack.push(undoStack.pop());
    canvas.loadFromJSON(undoStack[undoStack.length - 1] || {}, canvas.renderAll.bind(canvas));
  }
}

function redo() {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop(); 
      undoStack.push(JSON.stringify(canvas.toJSON())); 
      canvas.loadFromJSON(nextState, canvas.renderAll.bind(canvas)); 
    }
  }
  
 //font selection 
function changeFontFamily(font) {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.set({ fontFamily: font });
        canvas.renderAll();
    }
}

//font dropdown 
function initializeFontDropdown() {
    const fontDropdown = document.getElementById('font-selector');
    const fonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia']; 
    fonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font;
        option.text = font;
        fontDropdown.appendChild(option);
    });
    fontDropdown.addEventListener('change', (event) => {
        changeFontFamily(event.target.value);
    });
}
//increase font size
function increaseFontSize() {
    if (selectedText) {
        const currentFontSize = selectedText.fontSize;
        const newFontSize = Math.min(currentFontSize + 2, 100);  
        selectedText.set('fontSize', newFontSize);
        selectedText.canvas.renderAll();  
        updateFontSizeDisplay();  
    }
}

//decrease font size
function decreaseFontSize() {
    if (selectedText) {
        const currentFontSize = selectedText.fontSize;
        const newFontSize = Math.max(currentFontSize - 2, 8);  
        selectedText.set('fontSize', newFontSize);
        selectedText.canvas.renderAll();
        updateFontSizeDisplay();  
    }
}

//update font size
function updateFontSizeFromInput() {
    const fontSizeInput = document.getElementById('font-size-input');
    const newFontSize = parseInt(fontSizeInput.value, 10);
    if (selectedText && !isNaN(newFontSize)) {
        const clampedFontSize = Math.min(Math.max(newFontSize, 8), 100);
        selectedText.set('fontSize', clampedFontSize);
        selectedText.canvas.renderAll();
    }
}

function updateFontSizeDisplay() {
    if (selectedText) {
        const fontSizeInput = document.getElementById('font-size-input');
        fontSizeInput.value = selectedText.fontSize;
    }
}
//add text
function addText() {
    const text = new fabric.IText('Hello, Harleen', {
        left: 100, 
        top: 100,
        fontSize: 20,
        fill: 'black',
        fontFamily: 'Arial',
    });
    canvas.add(text);
    selectedText = text;  
    
    canvas.setActiveObject(text);  
    currentTextObject = text
    updateFontSizeDisplay();  
}
canvas.on('mouse:down', function (options) {
  if (!options.target) {
    const text = new fabric.IText('Hello, Harleen', {
      left: options.pointer.x,
      top: options.pointer.y,
    });
    canvas.add(text);
  }
});

//add image
function addImage(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    fabric.Image.fromURL(e.target.result, (img) => {
      img.scaleToWidth(200);
      canvas.add(img);
    });
  };
  reader.readAsDataURL(event.target.files[0]);
}

//text formatting bold italic etc.
function setBold() {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'i-text') {
    activeObject.fontWeight = activeObject.fontWeight === 'bold' ? 'normal' : 'bold';
    canvas.renderAll();
  }
}

function setItalic() {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'i-text') {
    activeObject.fontStyle = activeObject.fontStyle === 'italic' ? 'normal' : 'italic';
    canvas.renderAll();
  }
}

function setUnderline() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.fontStyle = activeObject.fontStyle === 'underline' ? 'normal' : 'underline';
      canvas.renderAll();
}}

function setTextJustify() {
    if (currentTextObject) {
        var currentAlign = currentTextObject.textAlign;
        if (currentAlign === 'left') {
            currentTextObject.set('textAlign', 'center');
        } else if (currentAlign === 'center') {
            currentTextObject.set('textAlign', 'right');
        } else {
            currentTextObject.set('textAlign', 'left');
        }
        canvas.renderAll();
    } else {
        alert("Please select text to apply justify.");
    }
}

//font family 
function changeFontFamily(font) {
    if (currentTextObject) {
        currentTextObject.set('fontFamily', font);
        canvas.renderAll();
    }
}
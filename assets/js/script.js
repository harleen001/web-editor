const canvas = new fabric.Canvas('editor-canvas');
const undoStack = [];
const redoStack = [];
let selectedText = null;

canvas.on('object:modified', saveState);
canvas.on('object:added', saveState);

// Save canvas state for undo/redo functionality
function saveState() {
    redoStack.length = 0;
    undoStack.push(canvas.toJSON());
}

// Undo functionality
function undo() {
    if (undoStack.length > 0) {
        redoStack.push(undoStack.pop());
        canvas.loadFromJSON(undoStack[undoStack.length - 1] || {}, canvas.renderAll.bind(canvas));
    }
}

// Redo functionality
function redo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        undoStack.push(JSON.stringify(canvas.toJSON()));
        canvas.loadFromJSON(nextState, canvas.renderAll.bind(canvas));
    }
}

// Font selection
function changeFontFamily(font) {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.set({ fontFamily: font });
        canvas.renderAll();
    }
}

// Initialize font dropdown
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

// Increase font size
function increaseFontSize() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        const currentFontSize = activeObject.fontSize;
        const newFontSize = Math.min(currentFontSize + 2, 100);
        activeObject.set('fontSize', newFontSize);
        canvas.renderAll();
        updateFontSizeDisplay();
    }
}

// Decrease font size
function decreaseFontSize() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        const currentFontSize = activeObject.fontSize;
        const newFontSize = Math.max(currentFontSize - 2, 8);
        activeObject.set('fontSize', newFontSize);
        canvas.renderAll();
        updateFontSizeDisplay();
    }
}

// Update font size input and display
function updateFontSizeDisplay() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        const fontSizeInput = document.getElementById('font-size-input');
        fontSizeInput.value = activeObject.fontSize;
    }
}

// Update font size from input field
function updateFontSizeFromInput() {
    const fontSizeInput = document.getElementById('font-size-input');
    const newFontSize = parseInt(fontSizeInput.value, 10);
    const activeObject = canvas.getActiveObject();
    if (activeObject && !isNaN(newFontSize)) {
        const clampedFontSize = Math.min(Math.max(newFontSize, 8), 100);
        activeObject.set('fontSize', clampedFontSize);
        canvas.renderAll();
    }
}

// Add text
function addText() {
    const text = new fabric.IText('Hello, Harleen', {
        left: 100,
        top: 100,
        fontSize: 20,
        fill: 'black',
        fontFamily: 'Arial',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    updateFontSizeDisplay();
}

// Add image
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

// Set bold
function setBold() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.fontWeight = activeObject.fontWeight === 'bold' ? 'normal' : 'bold';
        canvas.renderAll();
    }
}

// Set italic
function setItalic() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.fontStyle = activeObject.fontStyle === 'italic' ? 'normal' : 'italic';
        canvas.renderAll();
    }
}

// Set underline
function setUnderline() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        activeObject.fontStyle = activeObject.fontStyle === 'underline' ? 'normal' : 'underline';
        canvas.renderAll();
    }
}

// Set text justify (left, center, right)
function setTextJustify() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
        let currentAlign = activeObject.textAlign;
        if (currentAlign === 'left') {
            activeObject.set('textAlign', 'center');
        } else if (currentAlign === 'center') {
            activeObject.set('textAlign', 'right');
        } else {
            activeObject.set('textAlign', 'left');
        }
        canvas.renderAll();
    }
}

initializeFontDropdown();

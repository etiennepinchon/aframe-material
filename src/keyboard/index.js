const Draw = require('./draw');
const Behaviors = require('./behaviors');
const SFX = require('./sfx');

AFRAME.registerComponent('keyboard', {
  schema: {
    isOpen: { type: "boolean", default: false },
    physicalKeyboard: { type: "boolean", default: false }
  },

  init: function () {
    let that = this;

    this.actionsUI  = null;
    this.mainUI = null;
    this.numericalUI = null;
    this.hoverHighlight = null;
    this.alphabeticalLayout = null;
    this.symbolsLayout = null;

    this.currentInput = null;
    this.isShiftEnabled = false;
    this.isSymbols = false;
    this.shiftKey = null;

    this.keys = [];

    // SFX
    SFX.init(this.el);

    // Create keyboard.
    Draw.drawKeyboard(this);

    this.mainUI.addEventListener('raycaster-intersected', evt => {
      console.log(evt);
    });

    // Add event listeners to keys.
    this.keys.forEach(key => Behaviors.addKeyEvents(that, key) );

    // Inject methods in keyboard element.
    this.el.show = function() { Behaviors.showKeyboard(that); }
    this.el.hide = function() { Behaviors.hideKeyboard(that); }
    this.el.open = function() { Behaviors.openKeyboard(that); }
    this.el.dismiss = function() { Behaviors.dismissKeyboard(that); }
    this.el.destroy = function() { Behaviors.destroyKeyboard(that); }

    // Set default value
    this.el.setAttribute("scale", "2 2 2");
    this.el.setAttribute("rotation", "-20 0 0");
    this.el.setAttribute("position", "-1.5 -0.3 -2");

    // Register keyboard events
    this.el.addEventListener('input', this.inputEvent.bind(this));
    this.el.addEventListener('backspace', this.backspaceEvent.bind(this));
    this.el.addEventListener('dismiss', this.dismissEvent.bind(this));

    // Register global events
    document.addEventListener('keydown', this.keydownEvent.bind(this));
    document.body.addEventListener('didfocusinput', this.didFocusInputEvent.bind(this));
    document.body.addEventListener('didblurinput', this.didBlurInputEvent.bind(this));
  },

  update: function () {
    if (this.data.isOpen) {
      Behaviors.showKeyboard(this);
    } else {
      Behaviors.hideKeyboard(this);
    }
  },

  remove: function () {
    this.el.removeEventListener('input', this.inputEvent.bind(this));
    this.el.removeEventListener('backspace', this.backspaceEvent.bind(this));
    this.el.removeEventListener('dismiss', this.dismissEvent.bind(this));

    document.removeEventListener('keydown', this.keydownEvent.bind(this));
    document.body.removeEventListener('didfocusinput', this.didFocusInputEvent.bind(this));
    document.body.removeEventListener('didblurinput', this.didBlurInputEvent.bind(this));
  },

  // Fired on keyboard key press
  inputEvent: function(e) {
    if (this.currentInput) {
      this.currentInput.appendString(e.detail);
    }
  },

  // Fired on backspace key press
  backspaceEvent: function(e){
    if (this.currentInput) {
      this.currentInput.deleteLast();
    }
  },

  dismissEvent: function(e){
    if (this.currentInput) {
      this.currentInput.blur();
    }
  },

  // physical keyboard event
  keydownEvent: function(e) {
    if (this.currentInput && this.data.physicalKeyboard) {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Enter') {
        this.el.emit('input', '\n');
        this.el.emit('enter', '\n');
      }
      else if (e.key === 'Backspace') {
        this.el.emit('backspace');
      }
      else if (e.key === 'Escape') {
        this.el.emit('dismiss');
      }
      else if (e.key.length < 2) {
        this.el.emit('input', e.key);
      }
    }
  },

  // Fired when an input has been selected
  didFocusInputEvent: function(e) {
    if (this.currentInput) {
      this.currentInput.blur(true);
    }
    this.currentInput = e.detail;
    if (!this.el.isOpen) {
      Behaviors.openKeyboard(this);
    }
  },

  // Fired when an input has been deselected
  didBlurInputEvent: function(e) {
    this.currentInput = null;
    Behaviors.dismissKeyboard(this);
  }
});

AFRAME.registerPrimitive('a-keyboard', {
  defaultComponents: {
    keyboard: {}
  },
  mappings: {
    'is-open': 'keyboard.isOpen',
    'physical-keyboard': 'keyboard.physicalKeyboard',
  }
});

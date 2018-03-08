const Utils = require('../utils');
const Draw = require('./draw');
const Behaviors = require('./behaviors');
const SFX = require('./sfx');
const Event = require('../core/event');

AFRAME.registerComponent('keyboard', {
  schema: {
    isOpen: { type: "boolean", default: false },
    physicalKeyboard: { type: "boolean", default: false }
  },
  currentInput: null,
  init: function () {
    let that = this;

    // SFX
    SFX.init(this.el);

    // Draw
    Draw.init( this.el );

    // Init keyboard UI
    let numericalUI = Draw.numericalUI(),
        mainUI      = Draw.mainUI(),
        actionsUI   = Draw.actionsUI(),
        hoverHighlight = Draw.hoverHighlight();

    // Create layout
    this.el.alphabeticalLayout = Draw.alphabeticalLayout();
    this.el.symbolsLayout = Draw.symbolsLayout();

    // Append layouts to UI
    numericalUI.appendChild( Draw.numericalLayout() );
    mainUI.appendChild( this.el.alphabeticalLayout );
    actionsUI.appendChild( Draw.actionsLayout() );

    this.el.appendChild( numericalUI );
    this.el.appendChild( mainUI );
    this.el.appendChild( actionsUI );
    this.el.appendChild( hoverHighlight  );

    // Inject methods in elements..
    this.el.show = function() { Behaviors.showKeyboard(that.el); }
    this.el.hide = function() { Behaviors.hideKeyboard(that.el); }
    this.el.open = function() { Behaviors.openKeyboard(that.el); }
    this.el.dismiss = function() { Behaviors.dismissKeyboard(that.el); }
    this.el.destroy = function() { Behaviors.destroyKeyboard(that.el); }

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
      Behaviors.showKeyboard(this.el);
    } else {
      Behaviors.hideKeyboard(this.el);
    }
  },
  tick: function () {},
  remove: function () {
    this.el.removeEventListener('input', this.inputEvent.bind(this));
    this.el.removeEventListener('backspace', this.backspaceEvent.bind(this));
    this.el.removeEventListener('dismiss', this.dismissEvent.bind(this));

    document.removeEventListener('keydown', this.keydownEvent.bind(this));
    document.body.removeEventListener('didfocusinput', this.didFocusInputEvent.bind(this));
    document.body.removeEventListener('didblurinput', this.didBlurInputEvent.bind(this));
  },
  pause: function () {},
  play: function () {},

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
        Event.emit(Behaviors.el, 'input', '\n');
        Event.emit(Behaviors.el, 'enter', '\n');
      }
      else if (e.key === 'Backspace') {
        Event.emit(Behaviors.el, 'backspace');
      }
      else if (e.key === 'Escape') {
        Event.emit(Behaviors.el, 'dismiss');
      }
      else if (e.key.length < 2) {
        Event.emit(Behaviors.el, 'input', e.key);
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
      Behaviors.openKeyboard(this.el);
    }
  },

  // Fired when an input has been deselected
  didBlurInputEvent: function(e) {
    this.currentInput = null;
    Behaviors.dismissKeyboard(this.el);
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

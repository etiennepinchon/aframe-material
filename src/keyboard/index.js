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
        actionsUI   = Draw.actionsUI();

    // Create layout
    this.el.alphabeticalLayout = Draw.alphabeticalLayout();
    this.el.symbolsLayout = Draw.symbolsLayout();

    // Bind event listener scopes
    this.inputEvent = this.inputEvent.bind(this)
    this.backspaceEvent = this.backspaceEvent.bind(this)
    this.dismissEvent = this.dismissEvent.bind(this)
    this.keydownEvent = this.keydownEvent.bind(this)
    this.didFocusInputEvent = this.didFocusInputEvent.bind(this)
    this.didBlurInputEvent = this.didBlurInputEvent.bind(this)

    // Append layouts to UI
    numericalUI.appendChild( Draw.numericalLayout() );
    mainUI.appendChild( this.el.alphabeticalLayout );
    actionsUI.appendChild( Draw.actionsLayout() );

    this.el.appendChild( numericalUI );
    this.el.appendChild( mainUI );
    this.el.appendChild( actionsUI );

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
    this.el.addEventListener('input', this.inputEvent);
    this.el.addEventListener('backspace', this.backspaceEvent);
    this.el.addEventListener('dismiss', this.dismissEvent);

    // Register global events
    document.addEventListener('keydown', this.keydownEvent);
    document.body.addEventListener('didfocusinput', this.didFocusInputEvent);
    document.body.addEventListener('didblurinput', this.didBlurInputEvent);
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
    this.el.removeEventListener('input', this.inputEvent);
    this.el.removeEventListener('backspace', this.backspaceEvent);
    this.el.removeEventListener('dismiss', this.dismissEvent);

    document.removeEventListener('keydown', this.keydownEvent);
    document.body.removeEventListener('didfocusinput', this.didFocusInputEvent);
    document.body.removeEventListener('didblurinput', this.didBlurInputEvent);
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

const Utils = require('../utils');
const Assets = require('./assets');
const Draw = require('./draw');
const Behaviors = require('./behaviors');
const SFX = require('./sfx');

AFRAME.registerComponent('keyboard', {
  schema: {
    isOpen: { type: "boolean", default: false }
  },
  currentInput: null,
  init: function () {
    // Assets
    Utils.preloadAssets( Assets );

    // SFX
    SFX.init(this.el);

    // Draw
    Draw.init( this.el );

    let numericalUI = Draw.numericalUI(),
        mainUI      = Draw.mainUI(),
        actionsUI   = Draw.actionsUI();

    this.el.alphabeticalLayout = Draw.alphabeticalLayout();
    this.el.symbolsLayout = Draw.symbolsLayout();

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

    this.el.setAttribute("scale", "2 2 2");
    this.el.setAttribute("rotation", "-20 0 0");
    this.el.setAttribute("position", "-1.5 -0.3 -2");

    let that = this;
    this.el.addEventListener('input', (e)=>{
      if (that.currentInput) {
        that.currentInput.appendString(e.detail);
      }
    })
    this.el.addEventListener('backspace', (e)=>{
      if (that.currentInput) {
        that.currentInput.deleteLast();
      }
    })
    this.el.addEventListener('dismiss', (e)=>{
      if (that.currentInput) {
        that.currentInput.blur();
      }
    })
    document.body.addEventListener('didfocusinput', function(e) {
      if (that.currentInput) {
        that.currentInput.blur(true);
      }
      that.currentInput = e.detail;
      if (!that.el.isOpen) {
        Behaviors.openKeyboard(that.el);
      }
    })
    document.body.addEventListener('didblurinput', function(e) {
      that.currentInput = null;
      Behaviors.dismissKeyboard(that.el);
    })
  },
  update: function () {
    if (this.data.isOpen) {
      Behaviors.showKeyboard(this.el);
    } else {
      Behaviors.hideKeyboard(this.el);
    }
  },
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});

AFRAME.registerPrimitive('a-keyboard', {
  defaultComponents: {
    keyboard: {}
  },
  mappings: {
    'is-open': 'keyboard.isOpen',
  }
});

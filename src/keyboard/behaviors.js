const Config = require('./config');
const Utils = require('../utils');
const Event = require('../core/event');
const SFX = require('./sfx');
const Behaviors = {};

Behaviors.el = null;

// -----------------------------------------------------------------------------
// KEYBOARD METHODS

Behaviors.showKeyboard = function(el) {
  if (el.o_position) {
    el.object3D.position.copy(el.o_position);
  }
  el.isOpen = true;
  for(let item of el.querySelectorAll('[data-ui]') ) {
    for (let child of item.children) {
      child.setAttribute('show', true);
    }
  }
  let parent = el.parentNode;
  if (parent) { return; }
  el.sceneEl.appendChild(el);
};

Behaviors.hideKeyboard = function(el) {
  let position = el.getAttribute("position");
  if (position.x !== -10000) {
    if (!el.o_position) {
      el.o_position = new THREE.Vector3();
    }
    el.o_position.copy(position);
  }
  el.isOpen = false;
  el.setAttribute("position", "-10000 -10000 -10000");
  el.setAttribute('fadeout', {duration: 1});
}

Behaviors.destroyKeyboard = function(el) {
  let parent = el.parentNode;
  if (!parent) { return; }
  parent.removeChild(el);
};

Behaviors.openKeyboard = function(el) {
  if (el.o_position) {
    el.object3D.position.copy(o_position);
  }
  el.isOpen = true;
  el._transitioning = true;
  let parent = el.parentNode;
  if (!parent) { el.sceneEl.appendChild(el); }
  for(let item of el.querySelectorAll('[data-ui]') ) {
    for (let child of item.children) {
      child.setAttribute('hide', true);
    }
    function animationend() {
      item.children[0].removeEventListener('animationend', animationend)
      setTimeout(function() {
        item.children[1].setAttribute('fadein', {duration: 160});
        Event.emit(Behaviors.el, 'didopen');
        el._transitioning = false;
      }, 10)
    }
    item.children[0].setAttribute('fadein', {duration: 160});
    item.children[0].addEventListener('animationend', animationend)
  }
};

Behaviors.dismissKeyboard = function(el) {
  el._transitioning = true;
  for(let item of el.querySelectorAll('[data-ui]') ) {
    for (let child of item.children) {
      child.setAttribute('show', true);
    }
    el.isOpen = false;
    function animationend() {
      item.children[1].removeEventListener('animationend', animationend)
      setTimeout(function() {
        function animationend() {
          item.children[0].removeEventListener('animationend', animationend);
          Behaviors.hideKeyboard(el);
          Event.emit(Behaviors.el, 'diddismiss');
          el._transitioning = false;
        }
        item.children[0].setAttribute('fadeout', {duration: 160});
        item.children[0].addEventListener('animationend', animationend);
      }, 10)
    }
    item.children[1].setAttribute('fadeout', {duration: 160});
    item.children[1].addEventListener('animationend', animationend)
  }
};

// -----------------------------------------------------------------------------
// KEY EVENTS

Behaviors.addKeyEvents = (el)=>{
  el.addEventListener('click', Behaviors.keyClick);
  el.addEventListener('mousedown', Behaviors.keyDown);
  el.addEventListener('mouseup', Behaviors.keyOut);
  el.addEventListener('mouseleave', Behaviors.keyOut);
  el.addEventListener('mouseenter', Behaviors.keyIn );
  //el.addEventListener('raycaster-intersected', Behaviors.keyIn );
  //el.addEventListener('raycaster-intersected-cleared', Behaviors.keyOut );
  //triggerdown
  // https://aframe.io/docs/0.6.0/components/hand-controls.html
};

// -----------------------------------------------------------------------------
// KEYCLICK

Behaviors.keyClick = function() {
  SFX.keyDown(Behaviors.el);

  let type = this.getAttribute('key-type');
  let value = this.getAttribute('key-value');

  if (type === 'text' || type === 'spacebar') {
    if (type === 'spacebar') { value = ' '; }
    if (Behaviors.isShiftEnabled) {
      value = value.toUpperCase();
      Behaviors.shiftToggle();
    }
    else if (Behaviors.isSymbols) {
      Behaviors.symbolsToggle();
    }
    Event.emit(Behaviors.el, 'input', value);
  }
  else if (type === 'shift') {
    Behaviors.shiftToggle();
  }
  else if (type === 'symbol') {
    Behaviors.symbolsToggle();
  }
  else if (type === 'backspace') {
    Event.emit(Behaviors.el, 'backspace');
  }
  else if (type === 'enter') {
    Event.emit(Behaviors.el, 'input', '\n');
    Event.emit(Behaviors.el, 'enter', '\n');
  }
  else if (type === 'dismiss') {
    Event.emit(Behaviors.el, 'dismiss');
  }
}

// -----------------------------------------------------------------------------
// KEYDOWN

Behaviors.keyDown = function() {
  if (Behaviors.el._transitioning) { return; }
  this.object3D.position.z = 0.003;
  if (this.getAttribute('key-type') === 'spacebar') {
    this.setAttribute('color', Config.SPACEBAR_COLOR_ACTIVE);
  } else {
    this.setAttribute('color', Config.KEY_COLOR_ACTIVE);
  }
};

// -----------------------------------------------------------------------------
// KEYIN

Behaviors.keyIn = function() {
  if (Behaviors.el._transitioning) { return; }
  if (this.object3D.children[2] && this.object3D.children[2].material && !this.object3D.children[2].material.opacity) {
    return
  }
  SFX.keyIn(Behaviors.el);
  if (this.getAttribute('key-type') === 'spacebar') {
    this.setAttribute('color', Config.SPACEBAR_COLOR_HIGHLIGHT);
  } else {
    this.setAttribute('color', Config.KEY_COLOR_HIGHLIGHT);
  }
};

// -----------------------------------------------------------------------------
// KEYOUT

Behaviors.keyOut = function() {
  this.object3D.position.z = 0;
  if (this.getAttribute('key-type') === 'spacebar') {
    this.setAttribute('color', Config.KEY_COLOR_ACTIVE);
  } else {
    this.setAttribute('color', Config.KEYBOARD_COLOR);
  }
}

// -----------------------------------------------------------------------------
// SHIFT

Behaviors.isShiftEnabled = false;
Behaviors.shiftToggle = function() {
  Behaviors.isShiftEnabled = !Behaviors.isShiftEnabled;

  var icon_el = Behaviors.el.shiftKey.querySelector('[data-type]');
  if (Behaviors.isShiftEnabled) {
    icon_el.setAttribute('src', '#aframeKeyboardShiftActive');
  } else {
    icon_el.setAttribute('src', '#aframeKeyboardShift');
  }

  for ( let keyEl of document.querySelectorAll("[key-id]") ) {
    let key_id = keyEl.getAttribute('key-id'), key_type = keyEl.getAttribute('key-type');
    if (key_id.startsWith('main-') && key_type === "text") {
      let textEl = keyEl.querySelector('a-text');
      if (textEl) {
        let value = textEl.getAttribute('value').toLowerCase();
        if (this.isShiftEnabled) { value = value.toUpperCase(); }
        textEl.setAttribute('value', value);
      }
    }
  }
}

// -----------------------------------------------------------------------------
// SYMBOLS

Behaviors.isSymbols = false;
Behaviors.symbolsToggle = function() {
  Behaviors.isSymbols = !Behaviors.isSymbols;
  if (!Behaviors.isSymbols) {
    let parent = Behaviors.el.symbolsLayout.parentNode;
    parent.removeChild(Behaviors.el.symbolsLayout);
    parent.appendChild(Behaviors.el.alphabeticalLayout);
    setTimeout(function() {
      Utils.updateOpacity(Behaviors.el.alphabeticalLayout, 1);
    }, 0)
  } else {
    let parent = Behaviors.el.alphabeticalLayout.parentNode;
    parent.removeChild(Behaviors.el.alphabeticalLayout);
    parent.appendChild(Behaviors.el.symbolsLayout);
  }
}



module.exports = Behaviors;

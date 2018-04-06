const Assets = require('./assets');
const Config = require('./config');
const Utils = require('../utils');
const SFX = require('./sfx');

// -----------------------------------------------------------------------------
// KEYBOARD METHODS

function showKeyboard (component) {
  var el = component.el;
  if (component.o_position) {
    el.object3D.position.copy(component.o_position);
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
module.exports.showKeyboard = showKeyboard;

function hideKeyboard (component) {
  var el = component.el;
  let position = el.getAttribute("position");
  if (position.x !== -10000) {
    if (!component.o_position) {
      component.o_position = new THREE.Vector3();
    }
    component.o_position.copy(position);
  }
  el.isOpen = false;
  el.setAttribute("position", "-10000 -10000 -10000");
  el.setAttribute('fadeout', {duration: 1});
}
module.exports.hideKeyboard = hideKeyboard;

function destroyKeyboard (component) {
  var el = component.el;
  let parent = el.parentNode;
  if (!parent) { return; }
  parent.removeChild(el);
};
module.exports.destroyKeyboard = destroyKeyboard;

function openKeyboard (component) {
  var el = component.el;
  if (component.o_position) {
    el.object3D.position.copy(component.o_position);
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
        el.emit('didopen');
        el._transitioning = false;
      }, 10)
    }
    item.children[0].setAttribute('fadein', {duration: 160});
    item.children[0].addEventListener('animationend', animationend)
  }
};
module.exports.openKeyboard = openKeyboard;

function dismissKeyboard (component) {
  var el = component.el;
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
          hideKeyboard(component);
          el.emit('diddismiss');
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
module.exports.dismissKeyboard = dismissKeyboard;

// -----------------------------------------------------------------------------
// KEY EVENTS

function addKeyEvents (component, el) {
  el.addEventListener('click', () => { keyClick(component, el) });
  el.addEventListener('mousedown', () => { keyDown(component, el) });
  el.addEventListener('mouseup', () => { keyOut(component, el) });
  el.addEventListener('raycaster-intersected', () => { keyIn (component, el) });
  el.addEventListener('raycaster-intersected-cleared', () => { keyOut (component, el) });
  //triggerdown
  // https://aframe.io/docs/0.6.0/components/hand-controls.html
};
module.exports.addKeyEvents = addKeyEvents;

// -----------------------------------------------------------------------------
// KEYCLICK

function keyClick (keyEl) {
  var el = keyEl;
  SFX.keyDown(el);

  let type = el.getAttribute('key-type');
  let value = el.getAttribute('key-value');

  if (type === 'text' || type === 'spacebar') {
    if (type === 'spacebar') { value = ' '; }
    if (Behaviors.isShiftEnabled) {
      value = value.toUpperCase();
      Behaviors.shiftToggle();
    }
    else if (Behaviors.isSymbols) {
      Behaviors.symbolsToggle();
    }
    el.emit('input', value);
  }
  else if (type === 'shift') {
    shiftToggle();
  }
  else if (type === 'symbol') {
    symbolsToggle();
  }
  else if (type === 'backspace') {
    el.emit('backspace');
  }
  else if (type === 'enter') {
    el.emit('input', '\n');
    el.emit('enter', '\n');
  }
  else if (type === 'dismiss') {
    el.emit('dismiss');
  }
}
module.exports.keyClick = keyClick;

// -----------------------------------------------------------------------------
// KEYDOWN

function keyDown (component, keyEl) {
  var el = keyEl;
  var keyHighlight;
  if (el._transitioning) { return; }
  el.object3D.position.z = 0.003;
  if (el.getAttribute('key-type') === 'spacebar') {
    el.setAttribute('color', Config.SPACEBAR_COLOR_ACTIVE);
  } else {
    keyHighlight = component.hoverHighlight;
    keyHighlight.object3D.position.copy(el.object3D.position);
    keyHighlight.object3D.position.x += 0.04;
    keyHighlight.object3D.position.y += 0.036;
  }
};
module.exports.keyDown = keyDown;

// -----------------------------------------------------------------------------
// KEYIN

function keyIn (component, keyEl) {
  var el = keyEl;
  var keyHighlight;
  if (el._transitioning) { return; }
  if (el.object3D.children[2] && el.object3D.children[2].material &&
      !el.object3D.children[2].material.opacity) {
    return
  }
  SFX.keyIn(el);
  if (el.getAttribute('key-type') === 'spacebar') {
    el.children[0].setAttribute('slice9', 'color', Config.SPACEBAR_COLOR_HIGHLIGHT);
  } else {
    keyHighlight = component.hoverHighlight;
    keyHighlight.object3D.visible = true;
    keyHighlight.object3D.position.copy(el.object3D.position);
    keyHighlight.object3D.position.x += 0.04;
    keyHighlight.object3D.position.y += 0.036;
  }
};
module.exports.keyIn = keyIn;

// -----------------------------------------------------------------------------
// KEYOUT

function keyOut (component, keyEl) {
  var el = keyEl;
  var keyHighlight;
  el.object3D.position.z = 0;
  if (el.getAttribute('key-type') === 'spacebar') {
    el.children[0].setAttribute('slice9', 'color', Config.KEY_COLOR_ACTIVE);
  } else {
    keyHighlight = component.hoverHighlight;
    keyHighlight.object3D.visible = false;
  }
}
module.exports.keyOut = keyOut;

// -----------------------------------------------------------------------------
// SHIFT

function shiftToggle (component) {
  var el = component.el;
  component.isShiftEnabled = !component.isShiftEnabled;

  var icon_el = el.shiftKey.querySelector('[data-type]');
  if (component.isShiftEnabled) {
    icon_el.setAttribute('src', Assets.aframeKeyboardShiftActive);
  } else {
    icon_el.setAttribute('src', Assets.aframeKeyboardShift);
  }

  for ( let keyEl of document.querySelectorAll("[key-id]") ) {
    let key_id = keyEl.getAttribute('key-id'), key_type = keyEl.getAttribute('key-type');
    if (key_id.startsWith('main-') && key_type === "text") {
      let textEl = keyEl.querySelector('a-text');
      if (textEl) {
        let value = textEl.getAttribute('value').toLowerCase();
        if (el.isShiftEnabled) { value = value.toUpperCase(); }
        textEl.setAttribute('value', value);
      }
    }
  }
}
module.exports.shiftToggle = shiftToggle;

// -----------------------------------------------------------------------------
// SYMBOLS

function symbolsToggle (component) {
  var el = component.el;
  component.isSymbols = !component.isSymbols;
  if (!component.isSymbols) {
    let parent = el.symbolsLayout.parentNode;
    parent.removeChild(el.symbolsLayout);
    parent.appendChild(el.alphabeticalLayout);
    setTimeout(function() {
      Utils.updateOpacity(el.alphabeticalLayout, 1);
    }, 0)
  } else {
    let parent = el.alphabeticalLayout.parentNode;
    parent.removeChild(el.alphabeticalLayout);
    parent.appendChild(el.symbolsLayout);
  }
}
module.exports.symbolsToggle = symbolsToggle;

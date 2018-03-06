var Assets = require('./Assets');

const SFX = {

  init: function(parent) {
    let el = document.createElement('a-sound');
    el.setAttribute('key', 'aframeKeyboardKeyInSound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', Assets.aframeKeyboardKeyIn);
    el.setAttribute('position', '0 2 5');
    parent.appendChild(el);

    el = document.createElement('a-sound');
    el.setAttribute('key', 'aframeKeyboardKeyDownSound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', Assets.aframeKeyboardKeyDown);
    el.setAttribute('position', '0 2 5');
    parent.appendChild(el);
  },

  keyIn: function(parent) {
    let el = parent.querySelector('[key=aframeKeyboardKeyInSound]');
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  },

  keyDown: function(parent) {
    let el = parent.querySelector('[key=aframeKeyboardKeyDownSound]');
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  }
}

module.exports = SFX;

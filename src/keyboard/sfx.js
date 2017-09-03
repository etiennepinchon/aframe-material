const SFX = {

  init: function(parent) {
    let el = document.createElement('a-sound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeKeyboardKeyDown');
    el.setAttribute('position', '0 2 5');
    return el;
  },

  keyIn: function(el) {
    el.components.sound.stopSound();
    document.getElementById("aframeKeyboardKeyIn").currentTime = 0;
    el.setAttribute('src', '#aframeKeyboardKeyIn');
    el.components.sound.playSound();
  },

  keyDown: function(el) {
    el.components.sound.stopSound();
    document.getElementById("aframeKeyboardKeyDown").currentTime = 0;
    el.setAttribute('src', '#aframeKeyboardKeyDown');
    el.components.sound.playSound();
  }
}

module.exports = SFX;

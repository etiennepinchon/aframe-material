const SFX = {

  init: function(parent) {
    let el = document.createElement('a-sound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeButtonClick');
    el.setAttribute('position', '0 2 5');
    return el;
  },

  click: function(el) {
    el.components.sound.stopSound();
    document.getElementById("aframeButtonClick").currentTime = 0;
    el.setAttribute('src', '#aframeButtonClick');
    el.components.sound.playSound();
  },

  clickDisabled: function(el) {
    el.components.sound.stopSound();
    document.getElementById("aframeButtonClickDisabled").currentTime = 0;
    el.setAttribute('src', '#aframeButtonClickDisabled');
    el.components.sound.playSound();
  }
}

module.exports = SFX;

const SFX = {

  init: function(parent) {
    let el = document.createElement('a-sound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeRadioClick');
    el.setAttribute('position', '0 2 5');
    return el;
  },

  click: function(el) {
    el.components.sound.stopSound();
    document.getElementById("aframeRadioClick").currentTime = 0;
    el.setAttribute('src', '#aframeRadioClick');
    el.components.sound.playSound();
  },

  clickDisabled: function(el) {
    el.components.sound.stopSound();
    document.getElementById("aframeRadioClickDisabled").currentTime = 0;
    el.setAttribute('src', '#aframeRadioClickDisabled');
    el.components.sound.playSound();
  }
}

module.exports = SFX;

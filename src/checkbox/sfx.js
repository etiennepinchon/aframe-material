const SFX = {

  init: function(parent) {
    let el = document.createElement('a-sound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeCheckboxClick');
    el.setAttribute('position', '0 2 5');
    return el;
  },

  click: function(el) {
    el.components.sound.stopSound();
    document.getElementById("aframeCheckboxClick").currentTime = 0;
    el.setAttribute('src', '#aframeCheckboxClick');
    el.components.sound.playSound();
  },

  clickDisabled: function(el) {
    el.components.sound.stopSound();
    document.getElementById("aframeButtonClickDisabled").currentTime = 0;
    el.setAttribute('src', '#aframeCheckboxClickDisabled');
    el.components.sound.playSound();
  }
}

module.exports = SFX;

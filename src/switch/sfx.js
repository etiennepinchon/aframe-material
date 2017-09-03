const SFX = {
  
  init: function(parent) {
    let el = document.createElement('a-sound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeSwitchClick');
    el.setAttribute('position', '0 2 5');
    return el;
  },

  click: function(el) {
    el.components.sound.stopSound();
    document.getElementById("aframeSwitchClick").currentTime = 0;
    el.setAttribute('src', '#aframeSwitchClick');
    el.components.sound.playSound();
  },

  clickDisabled: function(el) {
    el.components.sound.stopSound();
    document.getElementById("aframeSwitchClickDisabled").currentTime = 0;
    el.setAttribute('src', '#aframeSwitchClickDisabled');
    el.components.sound.playSound();
  }
}

module.exports = SFX;

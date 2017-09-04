const SFX = {

  init: function(parent) {
    let el = document.createElement('a-sound');
    el.setAttribute('key', 'aframeSwitchClickSound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeSwitchClick');
    el.setAttribute('position', '0 2 5');
    parent.appendChild(el);

    el = document.createElement('a-sound');
    el.setAttribute('key', 'aframeSwitchClickDisabledSound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeSwitchClickDisabled');
    el.setAttribute('position', '0 2 5');
    parent.appendChild(el);
  },

  click: function(parent) {
    let el = parent.querySelector('[key=aframeSwitchClickSound]');
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  },

  clickDisabled: function(parent) {
    let el = parent.querySelector('[key=aframeSwitchClickDisabledSound]');
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  }
}

module.exports = SFX;

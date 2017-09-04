const SFX = {

  init: function(parent) {
    let el = document.createElement('a-sound');
    el.setAttribute('key', 'aframeRadioClickSound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeRadioClick');
    el.setAttribute('position', '0 2 5');
    parent.appendChild(el);

    el = document.createElement('a-sound');
    el.setAttribute('key', 'aframeRadioClickDisabledSound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeRadioClickDisabled');
    el.setAttribute('position', '0 2 5');
    parent.appendChild(el);
  },

  click: function(parent) {
    let el = parent.querySelector('[key=aframeRadioClickSound]');
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  },

  clickDisabled: function(parent) {
    let el = parent.querySelector('[key=aframeRadioClickDisabledSound]');
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  }
}

module.exports = SFX;

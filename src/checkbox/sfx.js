const SFX = {

  init: function(parent) {
    let el = document.createElement('a-sound');
    el.setAttribute('key', 'aframeCheckboxClickSound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeCheckboxClick');
    el.setAttribute('position', '0 2 5');
    parent.appendChild(el);

    el = document.createElement('a-sound');
    el.setAttribute('key', 'aframeButtonClickDisabledSound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeButtonClickDisabled');
    el.setAttribute('position', '0 2 5');
    parent.appendChild(el);
  },

  click: function(parent) {
    let el = parent.querySelector('[key=aframeCheckboxClickSound]');
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  },

  clickDisabled: function(parent) {
    let el = parent.querySelector('[key=aframeButtonClickDisabledSound]');
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  }
}

module.exports = SFX;

const SFX = {
  init: function(parent) {
    let el = document.createElement('a-sound');
    el.setAttribute('key', 'aframeToastShowSound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeToastShow');
    el.setAttribute('position', '0 2 5');
    parent.appendChild(el);
  },

  show: function(parent) {
    let el = parent.querySelector('[key=aframeToastShowSound]');
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  }
}

module.exports = SFX;

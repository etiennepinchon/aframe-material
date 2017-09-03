const SFX = {
  init: function(parent) {
    let el = document.createElement('a-sound');
    el.setAttribute('sfx', true);
    el.setAttribute('src', '#aframeToastShow');
    el.setAttribute('position', '0 2 5');
    return el;
  },

  show: function(el) {
    el.components.sound.stopSound();
    document.getElementById("aframeToastShow").currentTime = 0;
    el.setAttribute('src', '#aframeToastShow');
    el.components.sound.playSound();
  }
}

module.exports = SFX;

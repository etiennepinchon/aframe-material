const Utils = require('../utils');
const Event = require('../core/event');

AFRAME.registerComponent('alert', {
  schema: {
    title: { type: 'string', default: "" },
    message: { type: "string", default: "You are awesome!" },
    affirmative: { type: "string", default: "Agree" },
    dismissive: { type: "string", default: "" },
    backgroundColor: { type: "color", default: "#000" },
    fillColor: { type: "color", default: "#FFF" },
    titleColor: { type: "color", default: "#111" },
    messageColor: { type: "color", default: "#777" },
    font: { type: "string", default: "" },
    width: { type: "number", default: 1 }
  },
  init: function () {
    var that = this;

    // BACKGROUND
    this.background = document.createElement('a-sky');
    this.background.setAttribute('radius', 2.2)
    this.background.setAttribute('opacity', 0.2)
    this.background.setAttribute('position', '0 1 0')
    this.el.appendChild(this.background);

    // FILL
    this.fill = document.createElement('a-rounded');
    this.fill.setAttribute('width', 1)
    this.fill.setAttribute('height', 1)
    this.fill.setAttribute('radius', 0.01)
    this.fill.setAttribute('side', 'double')
    this.fill.setAttribute('position', '-0.5 1 -1.8');
    this.el.appendChild(this.fill);

    // TITLE
    this.title = document.createElement('a-entity');
    this.fill.appendChild(this.title);

    // MESSAGE
    this.message = document.createElement('a-entity');
    this.fill.appendChild(this.message);

    /*
    // Assets
    Utils.preloadAssets( Assets );

    // FILL
    this.el.fill = document.createElement('a-rounded');
    this.el.fill.setAttribute('width', 0.36)
    this.el.fill.setAttribute('height', 0.16)
    this.el.fill.setAttribute('radius', 0.08)
    this.el.fill.setAttribute('side', 'double')
    this.el.appendChild(this.el.fill);

    // KNOB
    this.el.knob = document.createElement('a-circle');
    this.el.knob.setAttribute('position', '0.06 0.08 0.002')
    this.el.knob.setAttribute('radius', 0.12)
    this.el.knob.setAttribute('side', 'double')
    this.el.appendChild(this.el.knob);

    // SHADOW
    this.el.shadow_el = document.createElement('a-image');
    this.el.shadow_el.setAttribute('width', 0.24*1.25);
    this.el.shadow_el.setAttribute('height', 0.24*1.25);
    this.el.shadow_el.setAttribute('position', '0 0 -0.001');
    this.el.shadow_el.setAttribute('src', '#aframeSwitchShadow');
    this.el.knob.appendChild(this.el.shadow_el);

    this.el.addEventListener('click', function() {
      that.el.setAttribute('enabled', !that.data.enabled );
    });*/
  },
  update: function () {
    this.background.setAttribute('color', this.data.backgroundColor);
    this.fill.setAttribute('color', this.data.fillColor);

    let props = {
      align: 'left',
      wrapCount: 20*(this.data.width+0.04),
      width: this.data.width,
      baseline: 'top'
    }
    if (this.data.font) { props.font = this.data.font; }

    // TITLE
    props.value = this.data.title;
    props.color = this.data.titleColor;
    this.title.setAttribute('text', props);

    // MESSAGE
    props.value = this.data.message;
    props.color = this.data.messageColor;
    props.wrapCount = 24*(this.data.width+0.04),
    this.message.setAttribute('text', props);

    this.fill.setAttribute('width', this.data.width);
    this.fill.setAttribute('position', -this.data.width/2+' 1 -1.4');
    this.title.setAttribute('position', this.data.width/2+0.06+' 0.92 0.001');
    this.message.setAttribute('position', this.data.width/2+' 0 0.001');


    /*if (this.data.enabled) {
      this.enable();
    } else {
      this.disable();
    }*/
  },
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});

AFRAME.registerPrimitive('a-alert', {
  defaultComponents: {
    alert: {}
  },
  mappings: {
    title: 'alert.title',
    message: 'alert.message',
    affirmative: 'alert.affirmative',
    dismissive: 'alert.dismissive',
    'background-color': 'alert.backgroundColor',
    'fill-color': 'alert.fillColor',
    'title-color': 'alert.titleColor',
    'message-color': 'alert.messageColor',
    font: 'alert.font',
    width: 'alert.width'
  }
});

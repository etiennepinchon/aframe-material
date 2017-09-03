const Utils = require('../utils');
const Event = require('../core/event');
const Assets = require('./assets');
const SFX = require('./sfx');

AFRAME.registerComponent('switch', {
  schema: {
    name: { type: "string", default: "" },
    enabled: { type: 'boolean', default: false },
    disabled: { type: 'boolean', default: false },
    fillColor: { type: "color", default: "#bababa" },
    knobColor: { type: "color", default: "#f5f5f5" },
    fillColorEnabled: { type: "color", default: "#80a8ff" },
    knobColorEnabled: { type: "color", default: "#4076fd" },
    fillColorDisabled: { type: "color", default: "#939393" },
    knobColorDisabled: { type: "color", default: "#a2a2a2" }
  },
  init: function () {
    var that = this;

    // Assets
    Utils.preloadAssets( Assets );

    // SFX
    this.SFX = SFX.init();
    this.el.appendChild( this.SFX );

    // FILL
    this.el.fill = document.createElement('a-rounded');
    this.el.fill.setAttribute('width', 0.36)
    this.el.fill.setAttribute('height', 0.16)
    this.el.fill.setAttribute('radius', 0.08)
    this.el.fill.setAttribute('side', 'double')
    this.el.fill.setAttribute('position', '0 0 0.001')
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
      if (this.components.switch.data.disabled) { return; }
      this.setAttribute('enabled', !this.components.switch.data.enabled );
      Event.emit(this, 'change', this.components.switch.data.enabled);
    });
    this.el.addEventListener('mousedown', function() {
      if (this.components.switch.data.disabled) {
        return SFX.clickDisabled(that.SFX);
      }
      SFX.click(that.SFX);
    });

    Object.defineProperty(this.el, 'enabled', {
      get: function() { return this.getAttribute('enabled'); },
      set: function(value) { this.setAttribute('enabled', value); },
      enumerable: true,
      configurable: true
    });
  },
  on: function() {
    this.el.fill.setAttribute('color', this.data.fillColorEnabled)
    this.el.knob.setAttribute('position', '0.32 0.08 0.002');
    this.el.knob.setAttribute('color', this.data.knobColorEnabled)
  },
  off: function() {
    this.el.fill.setAttribute('color', this.data.fillColor)
    this.el.knob.setAttribute('position', '0.06 0.08 0.002');
    this.el.knob.setAttribute('color', this.data.knobColor)
  },
  disable: function() {
    this.el.fill.setAttribute('color', this.data.fillColorDisabled)
    this.el.knob.setAttribute('color', this.data.knobColorDisabled)
  },
  update: function () {
    if (this.data.enabled) {
      this.on();
    } else {
      this.off();
    }
    if (this.data.disabled) {
      this.disable();
    }
  },
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});

AFRAME.registerPrimitive('a-switch', {
  defaultComponents: {
    switch: {}
  },
  mappings: {
    name: 'switch.name',
    enabled: 'switch.enabled',
    disabled: 'switch.disabled',
    'fill-color': 'switch.fillColor',
    'knob-color': 'switch.knobColor',
    'fill-color-enabled': 'switch.fillColorEnabled',
    'knob-color-enabled': 'switch.knobColorEnabled',
    'fill-color-disabled': 'switch.fillColorDisabled',
    'knob-color-disabled': 'switch.knobColorDisabled'
  }
});

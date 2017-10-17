const Utils = require('../utils');
const Event = require('../core/event');
const Assets = require('./assets');
const SFX = require('./sfx');

AFRAME.registerComponent('checkbox', {
  schema: {
    checked: { type: 'boolean', default: false },
    disabled: { type: 'boolean', default: false },
    name: { type: "string", default: "" },
    value: { type: "string", default: "" },
    label: { type: "string", default: "" },
    checkboxColor: { type: "color", default: "#757575"},
    checkboxColorChecked: { type: "color", default: "#4076fd"},
    color: { type: "color", default: "#757575" },
    font: { type: "string", default: "" },
    letterSpacing: { type: "int", default: 0 },
    lineHeight: { type: "string", default: "" },
    opacity: { type: "number", default: 1 },
    width: { type: "number", default: 1 }
  },
  init: function () {
    var that = this;

    // Assets
    Utils.preloadAssets( Assets );

    // SFX
    SFX.init(this.el);

    // HITBOX
    this.hitbox = document.createElement('a-plane');
    this.hitbox.setAttribute('height', 0.2);
    this.hitbox.setAttribute('opacity', 0);
    this.el.appendChild(this.hitbox);

    // OUTLINE
    this.outline = document.createElement('a-rounded');
    this.outline.setAttribute('width', 0.2);
    this.outline.setAttribute('height', 0.2);
    this.outline.setAttribute('radius', 0.02);
    this.outline.setAttribute('position', `0 -${0.2/2} 0.01`);
    this.el.appendChild(this.outline);

    // INSIDE
    this.inside = document.createElement('a-rounded');
    this.inside.setAttribute('width', 0.156);
    this.inside.setAttribute('height', 0.156);
    this.inside.setAttribute('radius', 0.01);
    this.inside.setAttribute('color', "#EEE");
    this.inside.setAttribute('position', `${0.156/8} -${0.156/2} 0.02`);
    this.el.appendChild(this.inside);

    // CHECKMARK
    this.checkmark = document.createElement('a-image');
    this.checkmark.setAttribute('width', 0.16);
    this.checkmark.setAttribute('height', 0.16);
    this.checkmark.setAttribute('src', "#aframeCheckboxMark");
    this.checkmark.setAttribute('position', '0.1 0 0.03');
    this.el.appendChild(this.checkmark);

    // LABEL
    this.label = document.createElement('a-entity');
    this.el.appendChild(this.label);

    // EVENTS
    this.el.addEventListener('click', function() {
      if (this.components.checkbox.data.disabled) { return; }
      this.components.checkbox.data.checked = !this.components.checkbox.data.checked;
      this.setAttribute('checked', this.components.checkbox.data.checked);
      that.onClick();
    });
    this.el.addEventListener('mousedown', function() {
      if (this.components.checkbox.data.disabled) {
        return SFX.clickDisabled(this);
      }
      SFX.click(this);
    });

    Object.defineProperty(this.el, 'value', {
      get: function() { return this.getAttribute('value'); },
      set: function(value) { this.setAttribute('value', value); },
      enumerable: true,
      configurable: true
    });
  },
  onClick: function(noemit) {
    if (this.data.checked) {
      this.check();
    } else {
      this.uncheck();
    }
    if (!noemit) { Event.emit(this.el, 'change', this.data.checked); }
  },
  check: function() {
    this.outline.setAttribute('color', this.data.checkboxColorChecked);
    this.inside.setAttribute('color', this.data.checkboxColorChecked);
    this.checkmark.setAttribute('visible', true);
    if (this.data.disabled) { this.disabled(); }
  },
  uncheck: function() {
    this.outline.setAttribute('color', this.data.checkboxColor);
    this.inside.setAttribute('color', "#EEE");
    this.checkmark.setAttribute('visible', false);
    if (this.data.disabled) { this.disabled(); }
  },
  disabled: function() {
    this.outline.setAttribute('color', this.data.checkboxColor);
    this.inside.setAttribute('color', this.data.checkboxColor);
  },
  update: function () {
    var that = this;
    this.onClick(true);

    // HITBOX
    this.hitbox.setAttribute('width', this.data.width)
    this.hitbox.setAttribute('position', this.data.width/2+' 0 0.01');

    let props = {
      color: this.data.color,
      align: 'left',
      wrapCount: 10*(this.data.width+0.2),
      width: this.data.width,
    }
    if (this.data.font) { props.font = this.data.font; }

    // TITLE
    props.value = this.data.label;
    props.color = this.data.color;
    this.label.setAttribute('text', props);
    this.label.setAttribute('position', this.data.width/2+0.24+' 0 0.01');

    // TRIM TEXT IF NEEDED.. @TODO: optimize this mess..
    function getTextWidth(el, _widthFactor) {
      if (!el.object3D || !el.object3D.children || !el.object3D.children[0]) { return 0; }
      let v = el.object3D.children[0].geometry.visibleGlyphs;
      if (!v) { return 0; }
      v = v[v.length-1];
      if (!v) { return 0; }
      if (v.line) {
        props.value = props.value.slice(0, -1);
        el.setAttribute("text", props);
        return getTextWidth(el);
      } else {
        if (!_widthFactor) { _widthFactor = Utils.getWidthFactor(el, props.wrapCount); }
        v = (v.position[0] + v.data.width) / (_widthFactor/that.data.width);
        let textRatio = v / that.data.width;
        if (textRatio > 1) {
          props.value = props.value.slice(0, -1);
          el.setAttribute("text", props);
          return getTextWidth(el, _widthFactor);
        }
      }
      return v;
    }
    setTimeout(function() {
      if (that.data.label.length) {
        getTextWidth(that.label);
      }
      if (that.data.disabled) {
        let timer = setInterval(function() {
          if (that.checkmark.object3D.children[0]) {
            clearInterval(timer);
            Utils.updateOpacity(that.checkmark, 0.4);
            Utils.updateOpacity(that.label, 0.4);
          }
        }, 10)
      } else {
        let timer = setInterval(function() {
          if (that.checkmark.object3D.children[0]) {
            clearInterval(timer);
            Utils.updateOpacity(that.checkmark, 1);
            Utils.updateOpacity(that.label, 1);
          }
        }, 10)
      }
    }, 0);
  },
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});

AFRAME.registerPrimitive('a-checkbox', {
  defaultComponents: {
    checkbox: {}
  },
  mappings: {
    checked: 'checkbox.checked',
    disabled: 'checkbox.disabled',
    name: 'checkbox.name',
    value: 'checkbox.value',
    label: 'checkbox.label',
    'checkbox-color': 'checkbox.checkboxColor',
    'checkbox-color-checked': 'checkbox.checkboxColorChecked',
    color: 'checkbox.color',
    align: 'checkbox.align',
    font: 'checkbox.font',
    'letter-spacing': 'checkbox.letterSpacing',
    'line-height': 'checkbox.lineHeight',
    'opacity': 'checkbox.opacity',
    width: 'checkbox.width'
  }
});

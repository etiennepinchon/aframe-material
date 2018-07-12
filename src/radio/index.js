const Utils = require('../utils');
const Event = require('../core/event');
const Assets = require('./assets');
const SFX = require('./sfx');

AFRAME.registerComponent('radio', {
  schema: {
    checked: { type: 'boolean', default: false },
    disabled: { type: 'boolean', default: false },
    name: { type: "string", default: "" },
    value: { type: "string", default: "" },
    label: { type: "string", default: "" },
    radioColor: { type: "color", default: "#757575" },
    radioColorChecked: { type: "color", default: "#4076fd" },
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
    Utils.preloadAssets(Assets);

    // SFX
    SFX.init(this.el);

    // HITBOX
    this.hitbox = document.createElement('a-plane');
    this.hitbox.setAttribute('height', 0.2);
    this.hitbox.setAttribute('opacity', 0);
    this.hitbox.setAttribute('position', '0 0 0.001')
    this.el.appendChild(this.hitbox);

    // OUTLINE
    this.outline = document.createElement('a-ring');
    this.outline.setAttribute('radius-outer', 0.1)
    this.outline.setAttribute('radius-inner', 0.078);
    this.outline.setAttribute('position', '0.1 0 0.002');
    this.el.appendChild(this.outline);

    // CIRCLE
    this.circle = document.createElement('a-circle');
    this.circle.setAttribute('radius', 0.05)
    this.circle.setAttribute('position', '0.1 0 0.002');
    this.el.appendChild(this.circle);

    // LABEL
    this.label = document.createElement('a-entity');
    this.el.appendChild(this.label);

    // EVENTS
    this.el.addEventListener('click', function () {
      var radioButtons = document.getElementsByName(this.components.radio.data.name);
      for (var radioButton of radioButtons)
        radioButton.checked = false;
      if (this.components.radio.data.disabled) { return; }
      this.setAttribute('checked', true);
      that.onClick();
    });

    this.el.addEventListener('mousedown', function () {
      if (this.components.radio.data.disabled) {
        return SFX.clickDisabled(this);
      }
      SFX.click(this);
    });

    Object.defineProperty(this.el, 'value', {
      get: function () { return this.getAttribute('value'); },
      set: function (value) { this.setAttribute('value', value); },
      enumerable: true,
      configurable: true
    });

    Object.defineProperty(this.el, 'checked', {
      get: function () { return this.getAttribute('checked'); },
      set: function (checked) { this.setAttribute('checked', checked); },
      enumerable: true,
      configurable: true
    });
  },
  onClick: function (noemit) {
    if (this.data.name) {
      let nearestForm = this.el.closest("a-form");
      if (nearestForm) {
        let didCheck = false;
        let children = Array.from(nearestForm.querySelectorAll(`[name=${this.data.name}]`));
        children.reverse();
        for (let child of children) {
          // Radio + not disabled
          if (child.components.radio) {
            // Currently checked
            if (child === this.el && child.hasAttribute('checked')) {
              didCheck = true;
              child.components.radio.check();
              if (!noemit) { Event.emit(child, 'change', true); }
            } else {
              if (!didCheck && !this.data.checked && child.hasAttribute('checked')) {
                didCheck = true;
                child.components.radio.check();
              } else {
                child.components.radio.uncheck();
              }
            }
          }
        }
        if (!didCheck && this.el.hasAttribute('checked')) {
          this.check();
          if (!noemit) { Event.emit(this.el, 'change', true); }
        }
      }
    }
  },
  check: function () {
    this.outline.setAttribute('color', this.data.radioColorChecked);
    this.circle.setAttribute('color', this.data.radioColorChecked);
    this.circle.setAttribute('visible', true);
    if (this.data.disabled) { this.disabled(); }
  },
  uncheck: function () {
    this.outline.setAttribute('color', this.data.radioColor);
    this.circle.setAttribute('visible', false);
    if (this.data.disabled) { this.disabled(); }
  },
  disabled: function () {
    this.outline.setAttribute('color', this.data.radioColor);
    this.circle.setAttribute('color', this.data.radioColor);
  },
  update: function () {
    var that = this;
    this.onClick(true);

    // HITBOX
    this.hitbox.setAttribute('width', this.data.width)
    this.hitbox.setAttribute('position', this.data.width / 2 + ' 0 0.001');

    let props = {
      color: this.data.color,
      align: 'left',
      wrapCount: 10 * (this.data.width + 0.2),
      width: this.data.width,
    }
    if (this.data.font) { props.font = this.data.font; }

    // TITLE
    props.value = this.data.label;
    props.color = this.data.color;
    this.label.setAttribute('text', props);
    this.label.setAttribute('position', this.data.width / 2 + 0.24 + ' 0 0.002');

    // TRIM TEXT IF NEEDED.. @TODO: optimize this mess..
    function getTextWidth(el, _widthFactor) {
      if (!el.object3D || !el.object3D.children || !el.object3D.children[0]) { return 0; }
      let v = el.object3D.children[0].geometry.visibleGlyphs;
      if (!v) { return 0; }
      v = v[v.length - 1];
      if (!v) { return 0; }
      if (v.line) {
        props.value = props.value.slice(0, -1);
        el.setAttribute("text", props);
        return getTextWidth(el);
      } else {
        if (!_widthFactor) { _widthFactor = Utils.getWidthFactor(el, props.wrapCount); }
        v = (v.position[0] + v.data.width) / (_widthFactor / that.data.width);
        let textRatio = v / that.data.width;
        if (textRatio > 1) {
          props.value = props.value.slice(0, -1);
          el.setAttribute("text", props);
          return getTextWidth(el, _widthFactor);
        }
      }
      return v;
    }
    setTimeout(function () {
      if (that.data.label.length) {
        getTextWidth(that.label);
      }
      if (that.data.disabled) {
        let timer = setInterval(function () {
          if (that.outline.object3D.children[0]) {
            clearInterval(timer);
            Utils.updateOpacity(that.outline, 0.4);
            Utils.updateOpacity(that.circle, 0.4);
            Utils.updateOpacity(that.label, 0.4);
          }
        }, 10)
      } else {
        let timer = setInterval(function () {
          if (that.outline.object3D.children[0]) {
            clearInterval(timer);
            Utils.updateOpacity(that.outline, 1);
            Utils.updateOpacity(that.circle, 1);
            Utils.updateOpacity(that.label, 1);
          }
        }, 10)
      }
    }, 0);
  },
  tick: function () { },
  remove: function () { },
  pause: function () { },
  play: function () { }
});

AFRAME.registerPrimitive('a-radio', {
  defaultComponents: {
    radio: {}
  },
  mappings: {
    checked: 'radio.checked',
    disabled: 'radio.disabled',
    name: 'radio.name',
    value: 'radio.value',
    label: 'radio.label',
    'radio-color': 'radio.radioColor',
    'radio-color-checked': 'radio.radioColorChecked',
    color: 'radio.color',
    align: 'radio.align',
    font: 'radio.font',
    'letter-spacing': 'radio.letterSpacing',
    'line-height': 'radio.lineHeight',
    'opacity': 'radio.opacity',
    width: 'radio.width'
  }
});

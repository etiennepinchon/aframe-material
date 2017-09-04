const Utils = require('../utils');
const Event = require('../core/event');
const Assets = require('./assets');
const SFX = require('./sfx');

AFRAME.registerComponent('button', {
  schema: {
    disabled: { type: 'boolean', default: false },
    type: { type: "string", default: "raised" },
    name: { type: "string", default: "" },
    value: { type: "string", default: "Button" },
    buttonColor: { type: "color", default: "#4076fd"},
    color: { type: "color", default: "#FFF" },
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

    this.wrapper = document.createElement('a-entity');
    this.wrapper.setAttribute('position', '0 0 0.01')
    this.el.appendChild(this.wrapper);

    this.shadow = document.createElement('a-image');
    this.shadow.setAttribute('height', 0.36*1.25);
    this.shadow.setAttribute('src', '#aframeButtonShadow');
    this.wrapper.appendChild(this.shadow);

    // OUTLINE
    this.outline = document.createElement('a-rounded');
    this.outline.setAttribute('height', 0.36);
    this.outline.setAttribute('radius', 0.03);
    this.outline.setAttribute('position', `0 -${0.36/2} 0.01`);
    this.wrapper.appendChild(this.outline);

    // LABEL
    this.label = document.createElement('a-entity');
    this.outline.appendChild(this.label);

    // EVENTS
    this.el.addEventListener('click', function() {
      if (this.components.button && this.components.button.data.disabled) { return; }
      that.onClick();
    });
    this.el.addEventListener('mousedown', function() {
      if (this.components.button && this.components.button.data.disabled) {
        return SFX.clickDisabled(this);
      }
      that.wrapper.setAttribute('position', `0 0 0.036`);
      SFX.click(this);
    });
    this.el.addEventListener('mouseup', function() {
      if (this.components.button && this.components.button.data.disabled) { return; }
      that.wrapper.setAttribute('position', `0 0 0`);
    });

    this.el.getWidth = this.getWidth.bind(this);
    Object.defineProperty(this.el, 'value', {
      get: function() { return this.getAttribute('value'); },
      set: function(value) { this.setAttribute('value', value); },
      enumerable: true,
      configurable: true
    });
  },
  onClick: function() {
    //Event.emit(this.el, 'click');
  },
  getWidth: function() {
    return this.__width;
  },
  update: function () {
    var that = this;
    this.outline.setAttribute('color', this.data.buttonColor);

    let props = {
      color: this.data.color,
      align: 'center',
      wrapCount: 10*this.data.width,
      width: this.data.width,
    }
    if (this.data.font) { props.font = this.data.font; }

    if (this.data.type === "flat") {
      props.color = this.data.buttonColor;
    }

    // TITLE
    props.value = this.data.value.toUpperCase();
    this.label.setAttribute('text', props);
    this.label.setAttribute('position', this.data.width/2+0.24+' 0 0.01');

    // TRIM TEXT IF NEEDED.. @TODO: optimize this mess..
    function getTextWidth(el, callback, _widthFactor) {
      if (!el.object3D || !el.object3D.children || !el.object3D.children[0]) {
        return setTimeout(function() {
          getTextWidth(el, callback);
        }, 10);
       }
      let v = el.object3D.children[0].geometry.visibleGlyphs;
      if (!v) {
        return setTimeout(function() {
          getTextWidth(el, callback);
        }, 10);
      }
      v = v[v.length-1];
      if (!v) { return callback(0); }
      if (v.line) {
        props.value = props.value.slice(0, -1);
        el.setAttribute("text", props);
        return getTextWidth(el, callback);
      } else {
        if (!_widthFactor) { _widthFactor = Utils.getWidthFactor(el, props.wrapCount); }
        v = (v.position[0] + v.data.width ) / (_widthFactor/that.data.width);
        let textRatio = v / that.data.width;
        if (textRatio > 1) {
          props.value = props.value.slice(0, -1);
          el.setAttribute("text", props);
          return getTextWidth(el, callback, _widthFactor);
        }
      }
      return callback(v);
    }
    setTimeout(function() {
      if (that.data.value.length) {
        getTextWidth(that.label, (width)=>{
          that.label.setAttribute('position', `${width/2+0.28/2} ${0.36/2} 0.02`);//
          width = width+0.28;
          that.outline.setAttribute('width', width);
          that.__width = width;
          that.shadow.setAttribute('width', width*1.17);
          that.shadow.setAttribute('position', width/2+' 0 0');
          Event.emit(that.el, 'change:width', width)
        });
      }

      if (that.data.disabled) {
        that.shadow.setAttribute('visible', false);
        let timer = setInterval(function() {
          if (that.label.object3D.children[0] && that.label.object3D.children[0].geometry.visibleGlyphs) {
            clearInterval(timer);
            Utils.updateOpacity(that.el, 0.4);
          }
        }, 10)
      } else {
        let timer = setInterval(function() {
          if (that.label.object3D.children[0] && that.label.object3D.children[0].geometry.visibleGlyphs) {
            clearInterval(timer);
            Utils.updateOpacity(that.el, 1);
          }
        }, 10)
      }

      if (that.data.type === "flat") {
        that.shadow.setAttribute('visible', false);
        let timer = setInterval(function() {
          if (that.label.object3D.children[0] && that.label.object3D.children[0].geometry.visibleGlyphs) {
            clearInterval(timer);
            Utils.updateOpacity(that.outline, 0);
            if (that.data.disabled) {
              Utils.updateOpacity(that.label, 0.4);
            }
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

AFRAME.registerPrimitive('a-button', {
  defaultComponents: {
    button: {}
  },
  mappings: {
    disabled: 'button.disabled',
    type: 'button.type',
    name: 'button.name',
    value: 'button.value',
    'button-color': 'button.buttonColor',
    color: 'button.color',
    font: 'button.font',
    'letter-spacing': 'button.letterSpacing',
    'line-height': 'button.lineHeight',
    'opacity': 'button.opacity',
    'width': 'button.width'
  }
});

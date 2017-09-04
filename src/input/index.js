const Utils = require('../utils');
const Event = require('../core/event');

/*
@BUG: Space has not effect when no letter comes after.
@TODO: <progress value="70" max="100">70 %</progress>
*/

AFRAME.registerComponent('input', {
  schema: {
    value: { type: "string", default: "" },
    name: { type: "string", default: "" },
    disabled: { type: "boolean", default: false },
    color: { type: "color", default: "#000" },
    align: { type: "string", default: "left" },
    font: { type: "string", default: "" },
    letterSpacing: { type: "int", default: 0 },
    lineHeight: { type: "string", default: "" },
    opacity: { type: "number", default: 1 },
    side: { type: "string", default: 'front' },
    tabSize: { type: "int", default: 4 },
    placeholder: { type: "string", default: "" },
    placeholderColor: { type: "color", default: "#AAA" },
    maxLength: { type: "int", default: 0 },
    type: { type: "string", default: "text" },
    width: { type: "number", default: 1 },
    cursorWidth: { type: "number", default: 0.01 },
    cursorHeight: { type: "number", default: 0.08 },
    cursorColor: { type: "color", default: "#007AFF" },
    backgroundColor: { type: "color", default: "#FFF" },
    backgroundOpacity: { type: "number", default: 1 },
  },

  init: function () {
    let that = this;

    this.background = document.createElement('a-rounded');
    this.background.setAttribute('radius', 0.01)
    this.background.setAttribute('height', 0.18)
    this.background.setAttribute('side', 'double')
    this.el.appendChild(this.background);

    this.cursor = document.createElement('a-plane');
    this.cursor.setAttribute('position', '0 0 0.003');
    this.cursor.setAttribute('visible', false);
    this.el.appendChild(this.cursor);

    this.text = document.createElement('a-entity');
    this.el.appendChild(this.text);

    this.placeholder = document.createElement('a-entity');
    this.placeholder.setAttribute('visible', false);
    this.el.appendChild(this.placeholder);

    this.el.focus = this.focus.bind(this);
    this.el.blur = this.blur.bind(this);
    this.el.appendString = this.appendString.bind(this);
    this.el.deleteLast = this.deleteLast.bind(this);

    //setTimeout(function() { that.updateText(); }, 0);
    this.blink();

    this.el.addEventListener('click', function() {
      if (this.components.input.data.disabled) { return; }
      that.focus();
    });

    Object.defineProperty(this.el, 'value', {
      get: function() { return this.getAttribute('value'); },
      set: function(value) { this.setAttribute('value', value); },
      enumerable: true,
      configurable: true
    });
  },
  blink: function() {
    let that = this;
    if (!this.isFocused) {
      that.cursor.setAttribute('visible', false);
      clearInterval(this.cursorInterval);
      this.cursorInterval = null;
      return
    }
    this.cursorInterval = setInterval(function(){
      that.cursor.setAttribute('visible', !that.cursor.getAttribute('visible'));
    }, 500);
  },
  isFocused: false,
  focus: function(noemit) {
    if (this.isFocused) { return; }
    this.isFocused = true;
    this.cursor.setAttribute('visible', true);
    this.blink();
    Event.emit(this.el, 'focus');
    if (!noemit) { Event.emit(document.body, 'didfocusinput', this.el); }
  },
  blur: function(noemit) {
    if (!this.isFocused) { return; }
    this.isFocused = false;
    if (this.cursorInterval) {
      clearInterval(this.cursorInterval);
      this.cursorInterval = null;
    }
    this.cursor.setAttribute('visible', false);
    Event.emit(this.el, 'blur');
    if (!noemit) { Event.emit(document.body, 'didblurinput', this.el); }
  },
  appendString: function(data) {
    if(data === '\n') {
      return this.blur();
    }
    let str = this.el.getAttribute("value");
    if (!str) { str = "" }
    str = str+data;
    this.el.setAttribute("value", str)
    Event.emit(this.el, 'change', str);
  },
  deleteLast: function() {
    let str = this.el.getAttribute("value");
    if (!str) { str = "" }
    str = str.slice(0, -1);
    this.el.setAttribute("value", str)
    Event.emit(this.el, 'change', str);
  },
  updateText: function() {
    let that = this;
    let padding = {
      left: 0.021,
      right: 0.021
    };

    let props = {
      color: this.data.color,
      align: this.data.align,
      side: this.data.side,
      tabSize: this.data.tabSize,
      wrapCount: 24*this.data.width,
      width: this.data.width
    }

    // Make cursor stop blinking when typing..
    // (and blinking again after typing stop).
    let attr = this.text.getAttribute("text");
    if (attr) {
      if (this.data.value !== attr.value) {
        if (this.cursorInterval) {
          clearInterval(this.cursorInterval);
          this.cursorInterval = null;
        }
        if (this.cursorTimer) {
          clearTimeout(this.cursorTimer);
          this.cursorTimer = null;
        }
        this.cursor.setAttribute('visible', true);
        this.cursorTimer = setTimeout(function(){
          that.blink();
        }, 50);
      }
    }

    // Max length
    if (this.data.maxLength) {
      props.value = this.data.value.substring(0, this.data.maxLength);
      this.el.setAttribute('value', props.value)
    } else {
      props.value = this.data.value;
    }

    if (this.data.type === "password") {
      props.value = "*".repeat(this.data.value.length);
    }

    if (this.data.font.length) { props.font = this.data.font }
    if (this.data.letterSpacing) { props.letterSpacing = this.data.letterSpacing; }
    if (this.data.lineHeight.length) { props.lineHeight = this.data.lineHeight; }
    this.text.setAttribute('visible', false);
    this.text.setAttribute("text", props);

    function getTextWidth(el, data, trimFirst, _widthFactor) {
      if (!el.object3D || !el.object3D.children || !el.object3D.children[0]) { return 0; }
      let v = el.object3D.children[0].geometry.visibleGlyphs;
      if (!v) { return 0; }
      v = v[v.length-1];
      if (!v) { return 0; }
      if (v.line) {
        if (trimFirst) {
          data.value = data.value.substr(1);
        } else {
          data.value = data.value.slice(0, -1);
        }
        el.setAttribute("text", data);
        return getTextWidth(el, data, trimFirst);
      } else {
        if (!_widthFactor) { _widthFactor = Utils.getWidthFactor(el, data.wrapCount); }
        v = (v.position[0] + v.data.width) / (_widthFactor/that.data.width);
        let textRatio = (v+padding.left+padding.right) / that.data.width;

        if (textRatio > 1) {
          if (trimFirst) {
            data.value = data.value.substr(1);
          } else {
            data.value = data.value.slice(0, -1);
          }
          el.setAttribute("text", data);
          return getTextWidth(el, data, trimFirst, _widthFactor);
        }
      }
      return v;
    }


    if (props.value.length) {
      this.placeholder.setAttribute('visible', false);
    } else {
      this.placeholder.setAttribute('visible', true);
    }

    let placeholder_props = Utils.clone(props);
    placeholder_props.value = this.data.placeholder;
    placeholder_props.color = this.data.placeholderColor;
    this.placeholder.setAttribute("text", placeholder_props);

    setTimeout(function() {
      if (that.text.object3D) {
        let children = that.text.object3D.children;
        if (children[0] && children[0].geometry && children[0].geometry.visibleGlyphs) {
          let v = 0;
          if (children[0].geometry.visibleGlyphs.length) {
            v = getTextWidth(that.text, props, true);
            that.text.setAttribute('visible', true);
          }
          that.cursor.setAttribute('position', v+padding.left+' 0 0.003');
        } else {
          that.cursor.setAttribute('position', padding.left+' 0 0.003');
        }
      } else {  that.cursor.setAttribute('position', padding.left+' 0 0.003'); }
      getTextWidth(that.placeholder, placeholder_props);
    }, 0)

    this.background.setAttribute('color', this.data.backgroundColor)
    /*if (this.data.backgroundOpacity) {
      setTimeout(function() {
        Utils.updateOpacity(that.background, that.data.backgroundOpacity);
      }, 0);
    }*/
    this.background.setAttribute('width', this.data.width);
    //this.background.setAttribute('position', this.data.width/2+' 0 0');
    this.background.setAttribute('position', '0 -0.09 0.001');
    this.text.setAttribute('position', padding.left-0.001+this.data.width/2+' 0 0.002');
    this.placeholder.setAttribute('position', padding.left-0.001+this.data.width/2+' 0 0.002');
  },
  updateCursor: function() {
    this.cursor.setAttribute('width', this.data.cursorWidth)
    this.cursor.setAttribute('height', this.data.cursorHeight)
    this.cursor.setAttribute('color', this.data.cursorColor);
  },
  update: function () {
    let that = this;
    setTimeout(function() {
    //  Utils.updateOpacity(that.el, that.data.opacity);
    }, 0)

    this.updateCursor();
    this.updateText();
  },
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});

AFRAME.registerPrimitive('a-input', {
  defaultComponents: {
    input: {}
  },
  mappings: {
    value: 'input.value',
    name: 'input.name',
    disabled: 'input.disabled',
    color: 'input.color',
    align: 'input.align',
    font: 'input.font',
    'letter-spacing': 'input.letterSpacing',
    'line-height': 'input.lineHeight',
    'opacity': 'input.opacity',
    'side': 'input.side',
    'tab-size': 'input.tabSize',
    placeholder: 'input.placeholder',
    'placeholder-color': 'input.placeholderColor',
    'max-length': 'input.maxLength',
    type: 'input.type',
    width: 'input.width',
    'cursor-width': "input.cursorWidth",
    'cursor-height': "input.cursorHeight",
    'cursor-color': "input.cursorColor",
    'background-color': 'input.backgroundColor',
    'background-opacity': 'input.backgroundOpacity'
  }
});

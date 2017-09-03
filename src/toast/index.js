const Utils = require('../utils');
const Event = require('../core/event');
const Assets = require('./assets');
const SFX = require('./sfx');

AFRAME.registerComponent('toast', {
  schema: {
    message: { type: 'string', default: "You are cool" },
    action: { type: 'string', default: "" },
    backgroundColor: { type: "color", default: "#222" },//242f35
    actionColor: { type: "color", default: "#4076fd"},
    color: { type: "color", default: "#FFF" },
    font: { type: "string", default: "" },
    letterSpacing: { type: "int", default: 0 },
    lineHeight: { type: "string", default: "" },
    width: { type: "number", default: 3 }
  },
  init: function () {
    var that = this;

    // Assets
    Utils.preloadAssets( Assets );

    // SFX
    this.SFX = SFX.init();
    this.el.appendChild( this.SFX );

    // CONFIG
    this.el.setAttribute("position", `10000 10000 10000`);
    this.el.setAttribute("rotation", "-25 0 0");

    // OUTLINE
    this.background = document.createElement('a-rounded');
    this.background.setAttribute('height', 0.44);
    this.background.setAttribute('radius', 0.03);
    this.background.setAttribute('position', `0 -${0.36/2} 0.001`);
    this.el.appendChild(this.background);

    // LABEL
    this.label = document.createElement('a-entity');
    this.el.appendChild(this.label);

    // LABEL
    this.action = document.createElement('a-button');
    that.action.setAttribute('button-color', '#222')

    this.el.appendChild(this.action);

    function changeWidth(e){
      let attr = that.label.getAttribute('text');
      attr.width = that.data.width-e.detail;
      attr.wrapCount = 10*attr.width;
      that.label.setAttribute('text', attr);
      that.label.setAttribute('position', attr.width/2+0.14+' 0.04 0.001');

      this.setAttribute('position', `${that.data.width-e.detail} ${(0.44-0.36)/2} 0.001`)
    }
    this.action.addEventListener('change:width', changeWidth);
    this.action.addEventListener('click', function() {
      //that.hide();
    })

    setTimeout(function() {
      Utils.updateOpacity(that.el, 0);
      Utils.updateOpacity(that.label, 0);
      Utils.updateOpacity(that.action, 0);
      that.el.setAttribute("position", `${-that.data.width/2} 0.25 -2.6`);
      that.show();
    }, 1000);

  },
  show: function() {
    let that = this;
    setTimeout(function() {
      that.el.setAttribute('fadein', {duration: 160});
      setTimeout(function() {
        Utils.updateOpacity(that.label, 1);
        that.action.components.button.shadow.setAttribute('visible', false);
      }, 10)
    }, 0)
    setTimeout(function() {
      that.hide();
    }, 2000);

    SFX.show(this.SFX);
  },
  hide: function() {
    let that = this;
    setTimeout(function() {
      Utils.updateOpacity(that.label, 0);
      that.action.components.button.shadow.setAttribute('visible', false);
      setTimeout(function() {
        that.el.setAttribute('fadeout', {duration: 160});
        setTimeout(function() {
          if (that.el.parentNode) {
            that.el.parentNode.removeChild(that.el);
          }
        }, 200);
      }, 10)
    }, 0);
  },
  onClick: function() {
    //Event.emit(this.el, 'click');
  },
  update: function () {
    var that = this;

    // BACKGROUND
    this.background.setAttribute('color', this.data.backgroundColor);
    this.background.setAttribute('width', this.data.width);

    let props = {
      color: this.data.color,
      align: 'left',
      wrapCount: 10*this.data.width,
      width: this.data.width,
      lineHeight: 64
    }
    if (this.data.font) { props.font = this.data.font; }

    if (this.data.type === "flat") {
      props.color = this.data.buttonColor;
    }

    // MESSAGE
    props.value = this.data.message
    this.label.setAttribute('text', props);
    this.label.setAttribute('position', this.data.width/2+0.14+' 0 0.001');

    // ACTION
    this.action.setAttribute('value', this.data.action.toUpperCase());
    this.action.setAttribute('color', this.data.actionColor);

    /*
    // TRIM TEXT IF NEEDED.. @TODO: optimize this mess..
    function getTextWidth(el, _widthFactor) {
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
    }*/
    setTimeout(function() {
      //console.log(that.action.getWidth() )
      /*if (that.data.value.length) {
        let width = getTextWidth(that.label);
        that.label.setAttribute('position', width/2+0.28+' 0 0.001');
        width = width+0.28+0.14;
        that.outline.setAttribute('width', width);

        that.shadow.setAttribute('width', width*1.16);
        that.shadow.setAttribute('position', width/2+' 0 0');
      }*/
    }, 0);
  },
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});

AFRAME.registerPrimitive('a-toast', {
  defaultComponents: {
    toast: {}
  },
  mappings: {
    message: 'toast.message',
    action: 'toast.action',
    'action-color': 'toast.actionColor',
    'background-color': 'toast.backgroundColor',
    color: 'toast.color',
    font: 'toast.font',
    'letter-spacing': 'toast.letterSpacing',
    'line-height': 'toast.lineHeight',
    'width': 'toast.width'
  }
});

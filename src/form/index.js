const Utils = require('../utils');
const Event = require('../core/event');

AFRAME.registerComponent('form', {
  schema: {
  },
  init: function () {
  },
  update: function () {
  },
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});

AFRAME.registerPrimitive('a-form', {
  defaultComponents: {
    form: {}
  },
  mappings: {
  }
});

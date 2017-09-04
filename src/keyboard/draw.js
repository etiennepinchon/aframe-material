const Layouts = require('./layouts');
const Config = require('./config');
const Behaviors = require('./behaviors');
const Draw = {};

Draw.el = null;

Draw.init = (el)=>{
  Draw.el = el;
  Behaviors.el = el;
  Behaviors.SFX = el.SFX;
}

// -----------------------------------------------------------------------------
// DRAW NUMERICAL UI

Draw.numericalUI = ()=> {
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '0.025 0 0.12');
  wrapper.setAttribute('rotation', '0 25 0');
  wrapper.setAttribute('data-ui', true);

  var el = document.createElement('a-rounded');
  el.setAttribute('width', '0.280');
  el.setAttribute('height', '0.360');
  el.setAttribute('radius', '0.02');
  el.setAttribute('color', Config.KEYBOARD_COLOR);
  wrapper.appendChild(el);

  return wrapper;
}

// -----------------------------------------------------------------------------
// DRAW MAIN UI

Draw.mainUI = ()=>{
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '0.312 0 0');
  wrapper.setAttribute('data-ui', true);

  var el = document.createElement('a-rounded');
  el.setAttribute('width', '0.840');
  el.setAttribute('height', '0.360');
  el.setAttribute('radius', '0.02');
  el.setAttribute('color', Config.KEYBOARD_COLOR);
  wrapper.appendChild(el);

  return wrapper;
}

// -----------------------------------------------------------------------------
// DRAW ACTION UI

Draw.actionsUI = ()=> {
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '1.180 0 0.01');
  wrapper.setAttribute('rotation', '0 -25 0');
  wrapper.setAttribute('data-ui', true);

  var el = document.createElement('a-rounded');
  el.setAttribute('width', '0.180');
  el.setAttribute('height', '0.360');
  el.setAttribute('radius', '0.02');
  el.setAttribute('color', Config.KEYBOARD_COLOR);
  wrapper.appendChild(el);

  return wrapper;
}

// -----------------------------------------------------------------------------
// DRAW NUMERICAL LAYOUT

Draw.numericalLayout = ()=> {
  var data = Layouts.numerical;
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '0.02 0.26 0.001');

  let index_y = 0;
  for (var i in data) {
    let key_id = 'num-'+i;
    let key = Draw.key(key_id, data[i].type, data[i].value);
    let index_x = i%3;
    let x = Config.KEY_WIDTH*index_x;
    let y = Config.KEY_WIDTH*index_y;
    key.setAttribute('position', `${x} -${y} 0`);
    if (index_x === 2) { index_y++; }
    wrapper.appendChild(key);
  }

  return wrapper;
}

// -----------------------------------------------------------------------------
// DRAW ALPHABETICAL LAYOUT

Draw.alphabeticalLayout = ()=> {
  var data = Layouts.alphabetical;
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '0.02 0.26 0.001');

  let index_y = 0, index_x = 0, prev_was_space = false;

  for (var i in data) {
    let key_id = 'main-'+i;
    let key = Draw.key(key_id, data[i].type, data[i].value);

    let x = Config.KEY_WIDTH*index_x;
    let y = Config.KEY_WIDTH*index_y;

    // Add left padding on the second line
    if (index_y === 1) {
      x = x + Config.KEY_WIDTH/2;
    }

    // Add margin on the key next to the spacebar key
    if (prev_was_space) {
      x = x + Config.SPACE_KEY_WIDTH - Config.KEY_WIDTH + (0.055*2);
    }

    // Add margin to the spacebar key
    if (data[i].type === 'spacebar') {
      prev_was_space = true;
      x = x+0.055;
      y = Config.KEY_WIDTH*index_y -  0.01;
    }

    key.setAttribute('position', `${x} -${y} 0`);

    if (index_y === 1 && index_x === 8) {
      index_x = -1;
      index_y++;
    } else if (index_x === 9) {
      index_x = -1;
      index_y++;
    }
    index_x++;

    wrapper.appendChild(key);
  }

  return wrapper;
}

// -----------------------------------------------------------------------------
// DRAW SYMBOLS LAYOUT

Draw.symbolsLayout = ()=> {
  var data = Layouts.symbols;
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '0.02 0.26 0.001');

  let index_y = 0, index_x = 0, prev_was_space = false;

  for (var i in data) {

    let key_id = 'symbols-'+i;
    let key = Draw.key(key_id, data[i].type, data[i].value);
    let x = Config.KEY_WIDTH*index_x;
    let y = Config.KEY_WIDTH*index_y;

    // Add margin on the key next to the spacebar key
    if (prev_was_space) {
      x = x + Config.SPACE_KEY_WIDTH - Config.KEY_WIDTH + (0.055*2);
    }

    // Add margin to the spacebar key
    if (data[i].type === 'spacebar') {
      prev_was_space = true;
      x = x+0.055;
      y = Config.KEY_WIDTH*index_y -  0.01;
    }

    key.setAttribute('position', `${x} -${y} 0`);

    if (index_x === 9) {
      index_x = -1;
      index_y++;
    }
    index_x++;
    wrapper.appendChild(key);
  }

  return wrapper;
}

// -----------------------------------------------------------------------------
// DRAW ACTIONS LAYOUT

Draw.actionsLayout = ()=> {
  var data = Layouts.actions;
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '0.02 0.26 0.001');

  let val_y = 0;
  for (var i in data) {
    let key_id = 'action-'+i;
    let key = Draw.key(key_id, data[i].type, data[i].value);

    key.setAttribute('position', `0 -${val_y} 0`);
    if (i == 0) {
      val_y += Config.ACTION_WIDTH+0.01;
    }
    else if (i == 1) {
      val_y += Config.KEY_WIDTH+0.01;
    }
    wrapper.appendChild(key);
  }

  return wrapper;
}

// -----------------------------------------------------------------------------
// DRAW KEY

Draw.key = (id, type, value)=> {
  var that = this;

  var el = document.createElement('a-rounded');
  el.setAttribute('key-id', id);
  el.setAttribute('width', Config.KEY_WIDTH);
  el.setAttribute('height', Config.KEY_WIDTH);
  el.setAttribute('radius', '0.008');
  el.setAttribute('position', '0 0 0');
  el.setAttribute('key-type', type);
  el.setAttribute('key-value', value);
  el.setAttribute('color', Config.KEYBOARD_COLOR);

  // ---------------------------------------------------------------------------
  // EVENTS

  Behaviors.addKeyEvents(el);

  // ---------------------------------------------------------------------------
  // SHADOW

  el.shadow_el = document.createElement('a-image');
  el.shadow_el.setAttribute('width', Config.KEY_WIDTH*1.25);
  el.shadow_el.setAttribute('height', Config.KEY_WIDTH*1.25);
  el.shadow_el.setAttribute('position', Config.KEY_WIDTH/2+' '+Config.KEY_WIDTH/2+' -0.002');
  el.shadow_el.setAttribute('src', '#aframeKeyboardShadow');
  el.appendChild(el.shadow_el);

  // ---------------------------------------------------------------------------
  // TEXT KEY

  if (type === 'text' || type === 'spacebar' || type ===  'symbol') {
    var letter_el = document.createElement('a-text');
    letter_el.setAttribute('value', value);
    letter_el.setAttribute('color', '#dbddde');
    letter_el.setAttribute('position', Config.KEY_WIDTH/2+' '+Config.KEY_WIDTH/2+' 0.01');
    letter_el.setAttribute('scale', '0.16 0.16 0.16');
    letter_el.setAttribute('align', 'center');
    letter_el.setAttribute('baseline', 'center');
    el.appendChild(letter_el);
  }

  // ---------------------------------------------------------------------------
  // SPACEBAR KEY

  if (type === 'spacebar') {
    el.setAttribute('width', Config.SPACE_KEY_WIDTH);
    el.setAttribute('height', Config.SPACE_KEY_HEIGHT);
    el.setAttribute('color', '#404b50');
    el.shadow_el.setAttribute('width', Config.SPACE_KEY_WIDTH*1.12);
    el.shadow_el.setAttribute('height', Config.SPACE_KEY_HEIGHT*1.2);
    el.shadow_el.setAttribute('position', Config.SPACE_KEY_WIDTH/2+' '+Config.SPACE_KEY_HEIGHT/2+' -0.02');
    letter_el.setAttribute('color', '#adb1b3');
    letter_el.setAttribute('scale', '0.12 0.12 0.12');
    letter_el.setAttribute('position', Config.SPACE_KEY_WIDTH/2+' '+Config.SPACE_KEY_HEIGHT/2+' 0');
  }

  // ---------------------------------------------------------------------------
  // SYMBOL KEY

  else if (type === 'symbol') {
    letter_el.setAttribute('scale', '0.12 0.12 0.12');
  }

  // ---------------------------------------------------------------------------
  // ACTION KEY

  if (type === 'backspace' || type === 'enter' || type === 'dismiss') {
    el.setAttribute('width', Config.ACTION_WIDTH);
    el.shadow_el.setAttribute('width', Config.ACTION_WIDTH*1.25);
    el.shadow_el.setAttribute('position', Config.ACTION_WIDTH/2+' '+Config.KEY_WIDTH/2+' -0.02');
  }

  // ---------------------------------------------------------------------------
  // SHIFT KEY

  if (type === 'shift') {
    var icon_el = document.createElement('a-image');
    icon_el.setAttribute('data-type', 'icon');
    icon_el.setAttribute('width', '0.032');
    icon_el.setAttribute('height', '0.032');
    icon_el.setAttribute('position', '0.04 0.04 0.01')
    icon_el.setAttribute('src', '#aframeKeyboardShift');
    el.appendChild(icon_el);
    Draw.el.shiftKey = el;
  }

  // ---------------------------------------------------------------------------
  // GLOBAL

  else if (type === 'global') {
    var icon_el = document.createElement('a-image');
    icon_el.setAttribute('width', '0.032');
    icon_el.setAttribute('height', '0.032');
    icon_el.setAttribute('position', '0.04 0.04 0.01')
    icon_el.setAttribute('src', '#aframeKeyboardGlobal');
    el.appendChild(icon_el);
  }

  // ---------------------------------------------------------------------------
  // BACKSPACE

  else if (type === 'backspace') {
    var icon_el = document.createElement('a-image');
    icon_el.setAttribute('width', '0.046');
    icon_el.setAttribute('height', '0.046');
    icon_el.setAttribute('position', '0.07 0.04 0.01')
    icon_el.setAttribute('src', '#aframeKeyboardBackspace');
    el.appendChild(icon_el);
  }

  // ---------------------------------------------------------------------------
  // ENTER

  else if (type === 'enter') {
    el.setAttribute('height', Config.ACTION_WIDTH);
    el.shadow_el.setAttribute('height', Config.ACTION_WIDTH*1.25);
    el.shadow_el.setAttribute('position', Config.ACTION_WIDTH/2+' '+Config.ACTION_WIDTH/2+' -0.02');

    var circle_el = document.createElement('a-circle');
    circle_el.setAttribute('color', '#4285f4');
    circle_el.setAttribute('radius', 0.044);
    circle_el.setAttribute('position', '0.07 0.07 0.01')
    el.appendChild(circle_el);

    var icon_el = document.createElement('a-image');
    icon_el.setAttribute('width', '0.034');
    icon_el.setAttribute('height', '0.034');
    icon_el.setAttribute('position', '0.07 0.07 0.011')
    icon_el.setAttribute('src', '#aframeKeyboardEnter');
    el.appendChild(icon_el);
  }

  // ---------------------------------------------------------------------------
  // DISMISS

  else if (type === 'dismiss') {
    var icon_el = document.createElement('a-image');
    icon_el.setAttribute('width', '0.046');
    icon_el.setAttribute('height', '0.046');
    icon_el.setAttribute('position', '0.07 0.04 0.01')
    icon_el.setAttribute('src', '#aframeKeyboardDismiss');
    el.appendChild(icon_el);
  }

  return el;
}

module.exports = Draw;

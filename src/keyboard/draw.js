const Assets = require('./assets');
const Layouts = require('./layouts');
const Config = require('./config');
const Behaviors = require('./behaviors');

module.exports.drawKeyboard = function (component) {
  // Init keyboard UI
  component.actionsUI  = drawActionsUI(component);
  component.mainUI = drawMainUI(component);
  component.numericalUI = drawNumericalUI(component);
  component.hoverHighlight = drawHoverHighlight(component);

  // Create layout
  component.alphabeticalLayout = drawAlphabeticalLayout(component);
  component.symbolsLayout = drawSymbolsLayout(component);

  // Append layouts to UI
  component.numericalUI.appendChild( drawNumericalLayout(component) );
  component.mainUI.appendChild( component.alphabeticalLayout );
  component.actionsUI.appendChild( drawActionsLayout(component) );

  component.el.appendChild( component.numericalUI );
  component.el.appendChild( component.mainUI );
  component.el.appendChild( component.actionsUI );
  component.el.appendChild( component.hoverHighlight  );
};

// -----------------------------------------------------------------------------
// DRAW HOVER HIGHLIGHT
function drawHoverHighlight (component) {
  var slice;
  slice = document.createElement('a-entity');
  slice.setAttribute('id', 'aframeKeyboardHighlight');
  slice.setAttribute('slice9', {
    color: Config.KEY_COLOR_ACTIVE,
    src: Assets.slice,
    left: 50,
    right: 52,
    top: 50,
    bottom: 52,
    padding: 0.04,
    width: Config.KEY_WIDTH,
    height: Config.KEY_WIDTH
  });
  return slice;
};

// -----------------------------------------------------------------------------
// DRAW NUMERICAL UI

function drawNumericalUI (component) {
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '0.025 0 0.12');
  wrapper.setAttribute('rotation', '0 25 0');
  wrapper.setAttribute('data-ui', true);

  var el = document.createElement('a-entity');
  el.setAttribute('slice9', {
    color: Config.KEYBOARD_COLOR,
    src: Assets.slice,
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
    padding: 0.04,
    width: 0.280,
    height: 0.360
  });
  el.setAttribute('position', '0.14 0.18 0');
  wrapper.appendChild(el);

  return wrapper;
}

// -----------------------------------------------------------------------------
// DRAW MAIN UI

function drawMainUI (component) {
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '0.312 0 0');
  wrapper.setAttribute('data-ui', true);

  var el = document.createElement('a-entity');
  el.setAttribute('slice9', {
    color: Config.KEYBOARD_COLOR,
    src: Assets.slice,
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
    padding: 0.04,
    width: 0.840,
    height: 0.360
  });
  el.setAttribute('position', '0.42 0.18 0');
  wrapper.appendChild(el);

  return wrapper;
}

// -----------------------------------------------------------------------------
// DRAW ACTION UI

function drawActionsUI (component) {
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '1.180 0 0.01');
  wrapper.setAttribute('rotation', '0 -25 0');
  wrapper.setAttribute('data-ui', true);

  var el = document.createElement('a-entity');
  el.setAttribute('slice9', {
    color: Config.KEYBOARD_COLOR,
    src: Assets.slice,
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
    padding: 0.04,
    width: 0.180,
    height: 0.360
  });
  el.setAttribute('position', '0.09 0.18 0');
  wrapper.appendChild(el);

  return wrapper;
}

// -----------------------------------------------------------------------------
// DRAW NUMERICAL LAYOUT

function drawNumericalLayout (component) {
  var data = Layouts.numerical;
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '0.02 0.26 0.001');

  let index_y = 0;
  for (var i in data) {
    let key_id = 'num-'+i;
    let key = drawKey(component, key_id, data[i].type, data[i].value);
    let index_x = i%3;
    let x = Config.KEY_WIDTH * index_x;
    let y = Config.KEY_WIDTH * index_y;
    key.setAttribute('position', `${x} -${y} 0`);
    if (index_x === 2) { index_y++; }
    wrapper.appendChild(key);
  }

  return wrapper;
}

// -----------------------------------------------------------------------------
// DRAW ALPHABETICAL LAYOUT
function drawAlphabeticalLayout (component) {
  var data = Layouts.alphabetical;
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '0.02 0.26 0.001');

  let index_y = 0, index_x = 0, prev_was_space = false;

  for (var i in data) {
    let key_id = 'main-'+i;
    let key = drawKey(component, key_id, data[i].type, data[i].value);

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

function drawSymbolsLayout (component) {
  var data = Layouts.symbols;
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '0.02 0.26 0.001');

  let index_y = 0, index_x = 0, prev_was_space = false;

  for (var i in data) {

    let key_id = 'symbols-'+i;
    let key = drawKey(component, key_id, data[i].type, data[i].value);
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

function drawActionsLayout (component) {
  var data = Layouts.actions;
  var wrapper = document.createElement('a-entity');
  wrapper.setAttribute('position', '0.02 0.26 0.001');

  let val_y = 0;
  for (var i in data) {
    let key_id = 'action-'+i;
    let key = drawKey(component, key_id, data[i].type, data[i].value);

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

function drawKey(component, id, type, value) {
  var el;
  var slice;

  el = document.createElement('a-entity');
  el.classList.add('aframeMaterialKey');
  el.setAttribute('key-id', id);
  el.setAttribute('key-type', type);
  el.setAttribute('key-value', value);

  if (type === 'spacebar') {
    slice = document.createElement('a-entity');
    slice.setAttribute('slice9', {
      color: Config.KEYBOARD_COLOR,
      src: Assets.slice,
      left: 50,
      right: 52,
      top: 50,
      bottom: 52,
      padding: 0.04,
      width: Config.KEY_WIDTH,
      height: Config.KEY_WIDTH
    });
    el.appendChild(slice);
  }

  // ---------------------------------------------------------------------------
  // TEXT KEY

  if (type === 'text' || type === 'spacebar' || type ===  'symbol') {
    var letter_el = document.createElement('a-text');
    letter_el.setAttribute('value', value);
    letter_el.setAttribute('color', '#dbddde');
    letter_el.setAttribute('position', {
      x: Config.KEY_WIDTH / 2,
      y: Config.KEY_WIDTH / 2,
      z: 0.01
    });
    letter_el.setAttribute('scale', '0.16 0.16 0.16');
    letter_el.setAttribute('align', 'center');
    letter_el.setAttribute('baseline', 'center');
    el.appendChild(letter_el);
  }

  // ---------------------------------------------------------------------------
  // SPACEBAR KEY

  if (type === 'spacebar') {
    slice.setAttribute('slice9', {
      color: '#404b50',
      width: Config.SPACE_KEY_WIDTH,
      height: Config.SPACE_KEY_HEIGHT
    });
    slice.setAttribute('position', '0.19 0.02 0');
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
  // SHIFT KEY

  if (type === 'shift') {
    var icon_el = document.createElement('a-image');
    icon_el.setAttribute('data-type', 'icon');
    icon_el.setAttribute('width', '0.032');
    icon_el.setAttribute('height', '0.032');
    icon_el.setAttribute('position', '0.04 0.04 0.01')
    icon_el.setAttribute('src', Assets.aframeKeyboardShift);
    el.appendChild(icon_el);
    component.shiftKey = el;
  }

  // ---------------------------------------------------------------------------
  // GLOBAL

  else if (type === 'global') {
    var icon_el = document.createElement('a-image');
    icon_el.setAttribute('width', '0.032');
    icon_el.setAttribute('height', '0.032');
    icon_el.setAttribute('position', '0.04 0.04 0.01')
    icon_el.setAttribute('src', Assets.aframeKeyboardGlobal);
    el.appendChild(icon_el);
  }

  // ---------------------------------------------------------------------------
  // BACKSPACE

  else if (type === 'backspace') {
    var icon_el = document.createElement('a-image');
    icon_el.setAttribute('width', '0.046');
    icon_el.setAttribute('height', '0.046');
    icon_el.setAttribute('position', '0.07 0.04 0.01')
    icon_el.setAttribute('src', Assets.aframeKeyboardBackspace);
    el.appendChild(icon_el);
  }

  // ---------------------------------------------------------------------------
  // ENTER

  else if (type === 'enter') {
    var circle_el = document.createElement('a-circle');
    circle_el.setAttribute('color', '#4285f4');
    circle_el.setAttribute('radius', 0.044);
    circle_el.setAttribute('position', '0.07 0.07 0.01')
    el.appendChild(circle_el);
    var icon_el = document.createElement('a-image');
    icon_el.setAttribute('width', '0.034');
    icon_el.setAttribute('height', '0.034');
    icon_el.setAttribute('position', '0.07 0.07 0.011')
    icon_el.setAttribute('src', Assets.aframeKeyboardEnter);
    el.appendChild(icon_el);
  }

  // ---------------------------------------------------------------------------
  // DISMISS

  else if (type === 'dismiss') {
    var icon_el = document.createElement('a-image');
    icon_el.setAttribute('width', '0.046');
    icon_el.setAttribute('height', '0.046');
    icon_el.setAttribute('position', '0.07 0.04 0.01')
    icon_el.setAttribute('src', Assets.aframeKeyboardDismiss);
    el.appendChild(icon_el);
  }

  component.keys.push(el);
  return el;
}

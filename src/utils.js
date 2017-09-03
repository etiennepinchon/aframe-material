const Utils = {};

/**
  Utils.preloadAssets([])
  Add assets to Assets managment system.
*/
Utils.preloadAssets = (assets_arr)=>{
  let assets = document.querySelector('a-assets'), already_exists;

  if (!assets) {
    var scene = document.querySelector('a-scene');
    assets = document.createElement('a-assets');
    scene.appendChild(assets);
  }

  for (let item of assets_arr) {
    already_exists = false;

    for (let stuff of assets.children) {
      if (item.id === stuff.id) {
        already_exists = true;
      }
    }

    if (!already_exists) {
      var asset_item = document.createElement(item.type);
      asset_item.setAttribute('id', item.id);
      asset_item.setAttribute('src', item.src);
      assets.appendChild(asset_item);
    }
  }
}


/**
  Utils.extend(a, b)
  Assign object to other object.
*/
Utils.extend = function(a, b) {
	for (let key in b) {
		if (b.hasOwnProperty(key)) {
			a[key] = b[key];
		}
	}
	return a;
};


Utils.updateOpacity = function(el, opacity) {
  if (el.hasAttribute('text')) {
    let props = el.getAttribute('text');
    props.opacity = opacity;
    el.setAttribute('text', props);
  }
  el.object3D.traverse(function (o) {
    if (o.material) {
      o.material.transparent = true;
      o.material.opacity = opacity;
    }
  });
  for (let text of el.querySelectorAll('a-text')) {
    text.setAttribute('opacity', opacity);
  }
}


// Calculate the width factor
Utils.getWidthFactor = function(el, wrapCount) {
  let widthFactor = 0.00001;
  if (el.components.text && el.components.text.currentFont) {
    widthFactor = el.components.text.currentFont.widthFactor
    widthFactor = ((0.5 + wrapCount) * widthFactor);
  }
  return widthFactor;
}

module.exports = Utils;

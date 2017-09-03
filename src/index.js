(()=>{
  if (!AFRAME) { return console.error('AFRAME is required!'); }
  if (!AFRAME.ASSETS_PATH) { AFRAME.ASSETS_PATH = "./assets"; }
  require('aframe-rounded');
  require("./fade");
  //require("./alert"); @TODO ;)
  require("./keyboard");
  require("./input");
  require("./switch");
  require("./form");
  require("./radio");
  require("./checkbox");
  require("./button");
  require("./toast");
})();

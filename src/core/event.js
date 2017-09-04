module.exports = {
  emit: (el, name, data)=> {
    el.dispatchEvent( new CustomEvent(name, {detail: data}) );
  }
}

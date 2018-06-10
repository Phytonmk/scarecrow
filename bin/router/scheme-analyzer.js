// const events = require(__dirname + '/events.json');

const layerAnalysis = (layer, event) => {
  if (typeof layer[event.event] !== 'undefined') {
    if (typeof layer[event.event] === 'function') {
      return layer[event.event];
    } else if (typeof layer[event.event] === 'object') {
      let coincidence = null;
      if (typeof event.ctx.text !== 'undefined')
        coincidence = event.ctx.text;
      else if (typeof event.ctx.caption !== 'undefined')
        coincidence = event.ctx.caption;
      for (let sublayer in layer[event.event]) {
        if (new RegExp(sublayer).test(coincidence) && typeof layer[sublayer] === 'function')
          return layer[sublayer];
      }
    } 
  }
}

module.exports = (user, scheme, event) => {
  for (let i = user.access; i >= 0; i--) {
    if (typeof scheme[i] !== 'undefined') {
      const layer = scheme[i];
      if (typeof layer.states !== 'undefined' && user.state !== '') {
        for (let state in layer.states) {
          if (state === user.state) {
            if (typeof layer.states[state] === 'function') {
              return layer.states[state];
            } else if (typeof layer.states[state] === 'object') {
              return layerAnalysis(layer.states[state], event);
            }
          }
        }
      }
      return layerAnalysis(layer, event);
    }
  }
}

var noop = function() { return function(){} }

module.exports = {

  fullController: {
    index: noop(),
    show: noop(),
    'new': noop(),
    create: noop(),
    show: noop(),
    edit: noop(),
    update: noop(),
    destroy: noop()
  },

  noop: noop

}
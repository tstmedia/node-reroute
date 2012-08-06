/*!
 * Rerouter
 *
 *
 *
 *
 * MIT Licensed
 */

var Router = require('routes').Router

var noop = function(){}


function Rerouter() {
  if (this.constructor !== Rerouter) { return new Rerouter() }

  this.router = new Router()
  this.router.addRoute('/:resource/:id/:action.:format?', noop)
  this.router.addRoute('/:resource/:id.:format?', noop)
  this.router.addRoute('/:resource', noop)
  this.router.addRoute('/:resource/*', noop)

  this.reroutes = {}
}

Rerouter.prototype.addResource = function(name, controller) {
  if (name in this.reroutes) throw new Error('Resource already registered')
  return this.reroutes[name] = {
    name : name,
    controller : controller,
    children : {},
    add : addChild
  }
}

Rerouter.prototype.match = function(url, method) {
  method || (method = 'GET')

  var match = this.router.match(url)
  if (!match || !match.fn) return false
  match.fn = null

  var resource = this.reroutes[match.params.resource]
  if (!resource) return false

  var controller = resource.controller

  var params = match.params
  if (!params.action && params.id && params.id in controller) {
    params.action = params.id
    params.id = undefined
  }
  else {
    var newUrl = ''
    if (params.id && params.id in resource.children)
      newUrl = '/' + url.split('/').slice(2).join('/')
    else if (match.splats.length === 1)
      newUrl = '/' + match.splats[0]
    if (newUrl) {
      var newMatch = this.match(newUrl, method)
      if (newMatch.params.resource in resource.children)
        return newMatch
      return false
    }
  }

  switch (method) {
    case 'GET':
    case 'HEAD':
      params.action || (params.action = params.id ? 'show' : 'index')
      break
    case 'POST':
      params.action || (params.action = 'create')
      break
    case 'PUT':
      params.action || (params.action = 'update')
      break
    case 'DELETE':
      params.action || (params.action = 'destroy')
      break
  }

  match.fn = controller[params.action]
  return match
}

function addChild(resource) {
  if (!resource || !resource.name || !resource.controller)
    throw new Error('Given resource is not a valid resource')

  var name = resource.name
  this.children[name] = resource
  return this
}

module.exports = Rerouter

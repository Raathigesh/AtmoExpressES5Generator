var fs = require('fs');
var Mustache = require('mustache');
var path = require('path');
var projectDirectory = path.join(process.cwd(), 'project');

/**
 * Generates the project files
 */
function generate(spec) {
  createProjectDirectory();
  spec = addHttpEndpointNames(spec);
  spec = addSocketEndpointFlag(spec);
  spec = addSocketEmitTypeFlag(spec);
  spec = isProxyEndpointAvailable(spec);
  writeFileSync('server.mustache', spec, 'server.js');
  writeFileSync('package.mustache', spec, 'package.json');
}

/**
 * Creates the output project directory
 */
function createProjectDirectory(content) {	
  if (!fs.existsSync(projectDirectory)){
    fs.mkdirSync(projectDirectory);
  }	
}

/**
 * Makes the http method names to express friendly name
 */
function addHttpEndpointNames(spec) {
  for(var i = 0; i < spec.endpoints.length; i++) {
    var endpoint = spec.endpoints[i];
    endpoint.httpMethod = endpoint.method.toLowerCase();
  }
  return spec;
}

/**
 * Add an additional flag to spec indicating weather
 * socket endpoints are available or not
 */
function addSocketEndpointFlag(spec) {
  if (spec.socketEndpoints.length > 0) {
    spec.isSocketEndpointAvailable = true;
  }
  return spec;
}

/**
 * Adds flags depending on the socket emit type
 */
function addSocketEmitTypeFlag(spec) {
  for(var i = 0; i < spec.socketEndpoints.length; i++) {
    var endpoint = spec.socketEndpoints[i];
    endpoint.isEmitSelf = endpoint.emitType === "self";
    endpoint.isEmitAll = endpoint.emitType === "all";
    endpoint.isEmitBroadcast = endpoint.emitType === "broadcast";
  }
  return spec;
}

/**
 * Adds a flag denoting weather any proxy endpoint is available in the spec
 */
function isProxyEndpointAvailable(spec) {
  if (spec.proxyEndpoints.length > 0) {
    spec.isProxyEndpoints = true;
  }
  return spec;
}

/**
 * Writes the file to the output folder
 */
function writeFileSync(templateName, templateOption, filename) {
  var templateString = fs.readFileSync(path.join(__dirname, '/templates/' + templateName), 'utf8');
  fs.writeFileSync(path.join(projectDirectory, filename), Mustache.render(templateString, templateOption));
}

module.exports = generate;
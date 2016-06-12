var fs = require('fs');
var Mustache = require('mustache');
var path = require('path');
var projectDirectory = path.join(process.cwd(), 'build');

/**
 * Generates the project files
 */
function generate(spec) {
  createProjectDirectory();
  spec = addHttpEndpointNames(spec);
  spec = addSocketEndpointFlag(spec);
  writeFileSync('server.mustache', spec, 'server.js');
  writeFileSync('package.mustache', {}, 'package.json');
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
 * Writes the file to the output folder
 */
function writeFileSync(templateName, templateOption, filename) {
  var templateString = fs.readFileSync(path.join(__dirname, '/templates/' + templateName), 'utf8');
  fs.writeFileSync(path.join(projectDirectory, filename), Mustache.render(templateString, templateOption));
}

module.exports = generate;
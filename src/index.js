const {
  argv,
  stdin,
  stdout,
  stderr,
  exit,
}  = require('process');
const path = require('path');
const { get } = require('./libs/request');

const fx = require('fx/fx');

const url = 'http://json.schemastore.org/tsconfig';
async function getData() {
  return await get(url);
}

const usage = `
  Usage: tcdr [options] | [parameters]
  Options:
    --help, -h      show tips
    --version, -v   show version
  Parameters:
    all             show all the definitions of tsconfig.json
    <attribute>     show specific attribute of the definitions
`;
function showUsage() {
  stdout.write(usage);
}

function showVersion() {
  const version = require(path.resolve('./package.json')).version;
  stdout.write(`v${ version }\n`);
}

async function showAll() {
  const data = await getData();
  fx('fx', data.definitions);
}


function getPropertyContentOfData(data, property) {

  // return `Error: Unknown property ${ property } in tsconfig.json.\n`;
}
async function showSpecificResult(property) {
  const data = await getData();
  const propertyContent = getPropertyContentOfData(data, property);

  if (typeof propertyContent === "object") {
    fx(property, propertyContent);
    return;
  }

  // stdout.write(propertyContent);
}

const args = argv.slice(2);
async function handleInput() {
  if (
    args.length === 0 ||
    (args[0] === '-h' || args[0] === '--help')
  ) {
    showUsage();
    return;
  }

  if (args[0] === '-v' || args[0] === '--version') {
    showVersion();
    return;
  }

  if (args[0] === 'all') {
    showAll();
    return;
  }

  showSpecificResult(args[0]);
}

async function main() {
  handleInput();
}

module.exports = main;
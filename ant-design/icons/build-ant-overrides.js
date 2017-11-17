const { icons } = require('./index.js');
const path = require('path');
const fs = require('fs');

const overrides = {
  // Ant class name : photon-icon mapping
  'down': 'arrowhead-down',
  'up': 'arrowhead-up',
  'left': 'arrowhead-left',
  'right': 'arrowhead-right',

  'double-right': 'double-arrow-right',
  'arrow-right': 'arrow-forward',
  'arrow-left': 'arrow-left',

  'clock-circle-o': 'clock',
  'info-circle-o': 'info',
  'info-circle': 'info-hover',

  'bulb': 'lightbulb',
  'menu-unfold': 'menu',
  'menu-fold': 'close-bold',
  'folder-open': 'open-dir',

  'exclamation-circle.ant-alert-icon': 'warning',
  'exclamation-circle-o.ant-alert-icon': 'warning'
};

const now = (new Date()).toLocaleString();

// Track what classes we want to create so only one definition is set per build.
const compiled = {};

const prefixIconClass = (base)=>`.anticon.anticon-${base}`;
const createIconClass = (className, content) => `${className}::before { content: "${content}"; }`;

// Import all Photon icons into Ant's icon format.
// This allows users to use Photon icons with Ant's Icon component, e.g.
// <Icon type="shield-disabled" />
Object.keys(icons).forEach(iconName => {
  const className = prefixIconClass(iconName);
  compiled[className] = createIconClass(className, icons[iconName]);
});

// Rewire the Ant icon mappings to point to Photon icon overrides.
Object.keys(overrides).forEach(ogIcon => {
  const className = prefixIconClass(ogIcon);
  compiled[className] = createIconClass(className, icons[overrides[ogIcon]]);
});


const output = `/* Autogenerated by build-ant-overrides.js ${now} */

${Object.keys(compiled).join(', \n')} {
  &::before {
    font-family: 'photon-icons' !important;
  }
}

${Object.values(compiled).sort().join('\n')}`;

try {
  fs.writeFileSync(path.resolve(__dirname, '../src/icon-overrides.less'), output);
} catch(err) {
  throw err;
}

console.log("Icon overrides LESS file was saved!");


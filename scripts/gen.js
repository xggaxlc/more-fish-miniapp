const { page, component } = require('optimist').argv;
const fse = require('fs-extra');
const path = require('path');
const { appRoot } = require('./config');

function genPage(page) {
  const dir = path.join(appRoot, `pages/${page}`);
  fse.ensureDirSync(dir);
  fse.writeFileSync(path.join(dir, `${page}.ts`), 'Page({});\n');
  fse.writeFileSync(path.join(dir, `${page}.scss`), '');
  fse.writeFileSync(path.join(dir, `${page}.json`), '{}\n');
  fse.writeFileSync(path.join(dir, `${page}.wxml`), `${page}\n`);
}

function genComponent(component) {
  const dir = path.join(appRoot, `components/${component}`);
  fse.ensureDirSync(dir);
  fse.writeFileSync(path.join(dir, `${component}.ts`), 'Component({});\n');
  fse.writeFileSync(path.join(dir, `${component}.scss`), '');
  fse.writeFileSync(path.join(dir, `${component}.json`), '{ "component": true }\n');
  fse.writeFileSync(path.join(dir, `${component}.wxml`), `${component}\n`);
}

page && genPage(page);
component && genComponent(component);


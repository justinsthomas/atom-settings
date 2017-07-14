'use strict';

const {openDocumentationInWebURL} = require('../urls');
const {renderValueHeader, renderExtend, renderExamples, renderUsages, renderDefinition, renderMembers, valueDescription, debugData, renderLinks} = require('./html-utils');

class KiteExpandModule extends HTMLElement {
  static initClass() {
    return document.registerElement('kite-expand-module', {prototype: this.prototype});
  }

  setData(data) {
    const {value} = data;

    this.innerHTML = `
    ${renderValueHeader(value)}
    ${renderExtend(value)}

    <div class="sections-wrapper">
      <section class="summary">${valueDescription(data)}</section>

      ${renderMembers(value)}
      ${renderExamples(data)}
      ${renderLinks(data)}
      ${renderDefinition(data)}
      ${renderUsages(data)}
      ${debugData(data)}
    </div>


    <footer>
      <div></div>
      <kite-open-link data-url="${openDocumentationInWebURL(value.id)}"></kite-open-link>
    </footer>
    `;
  }
}

module.exports = KiteExpandModule.initClass();

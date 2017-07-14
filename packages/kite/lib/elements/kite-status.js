'use strict';

require('./kite-logo');
const {Emitter, CompositeDisposable} = require('atom');
const {StateController: {STATES}} = require('kite-installer');
const {DisposableEvent} = require('../utils');

const TOOLTIPS = {
  [STATES.UNSUPPORTED]: 'Kite only supports macOS at the moment.',
  [STATES.UNINSTALLED]: 'Kite is not installed.',
  [STATES.INSTALLED]: 'Kite is not running.',
  [STATES.RUNNING]: 'Kite is running but not reachable.',
  [STATES.REACHABLE]: 'Kite is not authenticated.',
  [STATES.AUTHENTICATED]: 'Kite is not enabled for the current directory.',
  [STATES.WHITELISTED]: 'Kite is ready.',
};

const STATUSES = {
  [STATES.UNSUPPORTED]: 'unsupported',
  [STATES.UNINSTALLED]: 'uninstalled',
  [STATES.INSTALLED]: 'installed',
  [STATES.RUNNING]: 'running',
  [STATES.REACHABLE]: 'reachable',
  [STATES.AUTHENTICATED]: 'authenticated',
  [STATES.WHITELISTED]: 'whitelisted',
};

class StatusItem extends HTMLElement {
  static initClass() {
    return document.registerElement('kite-status', {
      prototype: this.prototype,
    });
  }

  onDidClick(listener) {
    return this.emitter.on('did-click', listener);
  }

  createdCallback() {
    this.emitter = new Emitter();
    this.updateOnGetState = true;
  }

  attachedCallback() {
    this.subscriptions = this.subscriptions || new CompositeDisposable();

    this.subscriptions.add(new DisposableEvent(this, 'click', () => {
      this.emitter.emit('did-click', this.getAttribute('status'));
    }));

    this.innerHTML = '<kite-logo></kite-logo>';
    this.classList.add('inline-block');
    this.tooltipText = '';

    this.setState(-1);
    if (this.app) { this.subscribe(); }
  }

  preventUpdatesOnGetState() {
    this.updateOnGetState = false;
  }

  resumeUpdatesOnGetState() {
    this.updateOnGetState = true;
  }

  detachedCallback() {
    this.subscriptions.dispose();
    delete this.app;
  }

  subscribe() {
    this.subscriptions = this.subscriptions || new CompositeDisposable();

    this.subscriptions.add(this.app.onDidGetState(state => {
      if (this.updateOnGetState) {
        this.setState(state, this.app.hasActiveSupportedFile());
      }
    }));

    this.subscriptions.add(atom.tooltips.add(this, {
      title: () => this.tooltipText,
    }));
  }

  setApp(app) {
    this.app = app;
    this.subscribe();
  }

  setState(state, supported) {
    if (state in STATUSES) {
      this.tooltipText = TOOLTIPS[state];
      this.setAttribute('status', STATUSES[state]);
      supported
        ? this.setAttribute('is-active-python-file', '')
        : this.removeAttribute('is-active-python-file');
    } else {
      this.tooltipText = `Kite is unknown state ${state}.`;
      this.setAttribute('status', 'unknown');
    }
    this.lastState = state;
  }
}

module.exports = StatusItem.initClass();

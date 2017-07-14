'use strict';
const md5 = require('md5');
const {Range} = require('atom');
const {head} = require('./utils');
const {StateController} = require('kite-installer');

function tokensPath(editor) {
  const state = md5(editor.getText());
  const filename = editor.getPath();
  const buffer = cleanPath(filename);
  return [
    `/api/buffer/atom/${buffer}/${state}/tokens`,
    `localtoken=${StateController.client.LOCAL_TOKEN}`,
  ].join('?');
}

function signaturePath() {
  return [
    '/clientapi/editor/signatures',
    `localtoken=${StateController.client.LOCAL_TOKEN}`,
  ].join('?');
}

function projectDirPath(path) {
  return [
    '/clientapi/projectdir',
    [
      `filename=${encodeURI(path)}`,
      `localtoken=${StateController.client.LOCAL_TOKEN}`,
    ].join('&'),
  ].join('?');
}

function shouldNotifyPath(path) {
  return [
    '/clientapi/permissions/notify',
    [
      `filename=${encodeURI(path)}`,
      `localtoken=${StateController.client.LOCAL_TOKEN}`,
    ].join('&'),
  ].join('?');
}

function completionsPath() {
  return [
    '/clientapi/editor/completions',
    `localtoken=${StateController.client.LOCAL_TOKEN}`,
  ].join('?');
}

function reportPath(data) {
  const value = head(head(data.symbol).value);

  return valueReportPath(value.id);
}

function valueReportPath(id) {
  return [
    `/api/editor/value/${id}`,
    `localtoken=${StateController.client.LOCAL_TOKEN}`,
  ].join('?');
}

function membersPath(id, page = 0, limit = 999) {
  return [
    `/api/editor/value/${id}/members`,
    [
      `offset=${page}`,
      `limit=${limit}`,
      `localtoken=${StateController.client.LOCAL_TOKEN}`,
    ].join('&'),
  ].join('?');
}

function usagesPath(id, page = 0, limit = 999) {
  return [
    `/api/editor/value/${id}/usages`,
    [
      `offset=${page}`,
      `limit=${limit}`,
      `localtoken=${StateController.client.LOCAL_TOKEN}`,
    ].join('&'),
  ].join('?');
}

function usagePath(id) {
  return [
    `/api/editor/usages/${id}`,
    `localtoken=${StateController.client.LOCAL_TOKEN}`,
  ].join('?');
}

function examplePath(id) {
  return [
    `/api/python/curation/${id}`,
    `localtoken=${StateController.client.LOCAL_TOKEN}`,
  ].join('?');
}
function appendToken(url) {
  const token = StateController.client.LOCAL_TOKEN;
  return url.indexOf('?') !== -1
    ? `${url}&localtoken=${token}`
    : `${url}?localtoken=${token}`;
}
function openDocumentationInWebURL(id, token = false) {
  const url = `http://localhost:46624/clientapi/desktoplogin?d=/docs/python/${escapeId(id)}`;
  return token ? appendToken(url) : url;
}

function openSignatureInWebURL(id, token = false) {
  const url = `http://localhost:46624/clientapi/desktoplogin?d=/docs/python/${escapeId(id)}%23signature`;
  return token ? appendToken(url) : url;
}

function openExampleInWebURL(id, token = false) {
  const url = `http://localhost:46624/clientapi/desktoplogin?d=/examples/python/${escapeId(id)}`;
  return token ? appendToken(url) : url;
}

function hoverPath(editor, range) {
  range = Range.fromObject(range);

  const state = md5(editor.getText());
  const filename = editor.getPath();
  const buffer = cleanPath(filename);
  const start = editor.getBuffer().characterIndexForPosition(range.start);
  const end = editor.getBuffer().characterIndexForPosition(range.end);
  return [
    `/api/buffer/atom/${buffer}/${state}/hover`,
    [
      `selection_begin_bytes=${start}`,
      `selection_end_bytes=${end}`,
      `localtoken=${StateController.client.LOCAL_TOKEN}`,
    ].join('&'),
  ].join('?');
}

function escapeId(id) {
  return encodeURI(String(id)).replace(/;/g, '%3B');
}

function cleanPath(p) {
  return encodeURI(p)
  .replace(/^([A-Z]):/, '/windows/$1')
  .replace(/\/|\\|%5C/g, ':');
}

function internalURL(path) {
  return `kite-atom-internal://${path}`;
}

function internalGotoURL(def) {
  return internalURL(`goto/${def.filename}:${def.line}`);
}

function internalGotoIdURL(id) {
  return internalURL(`goto-id/${id}`);
}

function internalExpandURL(id) {
  return internalURL(`expand/${id}`);
}

function internalExpandRangeURL(range) {
  return internalURL(`expand-range/${serializeRangeForPath(range)}`);
}

function internalGotoRangeURL(range) {
  return internalURL(`goto-range/${serializeRangeForPath(range)}`);
}

function internalOpenRangeInWebURL(range) {
  return internalURL(`open-range/${serializeRangeForPath(range)}`);
}

function serializeRangeForPath(range) {
  return `${range.start.row}:${range.start.column}/${range.end.row}:${range.end.column}`;
}

module.exports = {
  appendToken,
  completionsPath,
  examplePath,
  hoverPath,
  internalExpandRangeURL,
  internalExpandURL,
  internalGotoIdURL,
  internalGotoRangeURL,
  internalGotoURL,
  internalOpenRangeInWebURL,
  internalURL,
  membersPath,
  openDocumentationInWebURL,
  openExampleInWebURL,
  openSignatureInWebURL,
  projectDirPath,
  reportPath,
  serializeRangeForPath,
  shouldNotifyPath,
  signaturePath,
  tokensPath,
  usagePath,
  usagesPath,
  valueReportPath,
};

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var LOADABLE_MARKS = {};
var USED_MARKS = {};

var useMark = exports.useMark = function useMark(stream, marks) {
  if (marks && marks.length) {
    if (!USED_MARKS[stream]) {
      USED_MARKS[stream] = {};
    }
    marks.forEach(function (a) {
      return USED_MARKS[stream][a] = true;
    });
  }
};

var drainHydrateMarks = exports.drainHydrateMarks = function drainHydrateMarks() {
  var stream = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  var used = Object.keys(USED_MARKS[stream] || {});
  delete USED_MARKS[stream];
  return used;
};

var rehydrateMarks = exports.rehydrateMarks = function rehydrateMarks() {
  var marks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var rehydrate = marks || global.___REACT_DEFERRED_COMPONENT_MARKS || [];
  return Promise.all(rehydrate.map(function (mark) {
    return LOADABLE_MARKS[mark];
  }).filter(function (it) {
    return !!it;
  }).map(function (loadable) {
    return loadable.load();
  }));
};

var printDrainHydrateMarks = exports.printDrainHydrateMarks = function printDrainHydrateMarks() {
  var stream = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  return "<script>window.___REACT_DEFERRED_COMPONENT_MARKS=" + JSON.stringify(drainHydrateMarks(stream)) + ";/*stream " + stream + "*/</script>";
};

exports.default = LOADABLE_MARKS;
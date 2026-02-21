// ./assets/qt3/js/model/grammer.js

export const GRAMMAR = {
  placement:        /([XO])(\d+)\+\((\d),(\d)\)/g,
  collapseEvent:    /@([XO])(\d+)\((\d)\)/g,
  collapseResolve:  /!([XO])(\d+)\((\d)\)/g,
  spooky:           /([XO])(\d+)\+\((\d)$/
  // loop:          /\[(\d+)(?:\|(\d+))?\]/g;
};


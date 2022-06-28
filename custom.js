(function () {
  var pivotLibs = {
    css: [
      //'/graph.css',
      '/workflowtree.css',
    ],
    js: [
      //'/mdt.graphWidget.min.js',
      //'/mdt.cyWidget.min.js',
      '/mdt.workflowEngineWidget.js',
      '/components/element-card.js',
    ],
  };

  $.each(pivotLibs.css, function (i, o) {
    mdt.loadCSS(o);
  });

  var fnLoadJS = function () {
    if (!pivotLibs.js.length) return;

    var js = pivotLibs.js[0];
    pivotLibs.js.splice(0, 1);
    mdt.loadJS(js, fnLoadJS);
  };

  fnLoadJS();
})();

$.widget('mdt.workflowEngineWidget', $.mdt.app2Widget, {
  options: {
    structuredData: {},
    widgetType: 'workflowEngineWidget',
    newNodeButton: null,
    addNodeDialog: null,
    treeContainer: null,
    newNodeDialog: null,
    recentered: false,
    droppedInsideContainer: false,
    d3ContainerBoundingClient: {},
    actions: {
      Add: false,
      fnAdd: null,
      classAdd: null,
      labelAdd: null,
      Edit: false,
      fnEdit: null,
      classEdit: null,
      labelEdit: null,
      Delete: false,
      fnDelete: null,
      classDelete: null,
      labelDelete: null,
      Copy: true,
      fnCopy: null,
      classCopy: null,
      labelCopy: null,
      fnCustomDialog: null,
      CopyCell: true,
      fnCopyCell: null,
      labelCopyCell: '',
      // to be completed/replaced
    },
    currentScale: 1,
    currentDrawAreaTranslation: [0, 0],
    isInteractedWith: false,
    d3Zoom: {},
    baseSvg: {},
    svgGroup: {},
    updateType: {
      DefaultLayout: 'defaultLayout',
      DragDrop: 'dragDrop',
    },
    nodeAddMode: {
      Manual: 'manual',
      Auto: 'auto',
    },
    lastChildAdded: {},
  },

  _templates: {
    currentWidget:
      '<div class="d3-container">\
          <ct-visualization id="tree-container" class="d3-container tree-container"/>\
          <div class="d3-ctx-menu">\
            <ul class="d3-ctx-menu-options">\
              <li class="d3-ctx-menu-option ctx-menu-exportXML" id="exportXML">\
                Export XML\
              </li>\
              <li class="d3-ctx-menu-option ctx-menu-recenterGraph" id="recenterGraph">\
                Recenter Graph\
              </li>\
            </ul>\
          </div>\
            <div class="workflow-engine-designer-nodetypes svg-wrapper">\
              <svg class="workflow-engine-designer-nodetypes plus-btn">\
              </svg>\
            </div>\
          <div class="workflow-engine-dialog workfow-engine-designer-nodetypes">\
              <div class="workflow-engine-designer-container">\
                  <div class="workflow-engine-dialog-header">\
                      <h3>Elements</h3>\
                      <span class="png_images workflow-engine-designer_closethick">\
                      </span>\
                  </div>\
                  <div class="workflow-engine-dialog-body">\
                      <form class = "node-types-form">\
                      </form>\
                  </div>\
              </div>\
          </div>\
      </div>',

    addNodeDialog:
      '<div class="workflow-engine-dialog ui-dialog ui-corner-all\
   ui-widget ui-widget-content ui-front dlgfixed ui-resizable ui-dialog-buttons"/>',
  },

  // -------------------------------------------------------------
  // Static members
  // -------------------------------------------------------------

  contextMenuOptions: {},

  _commandList: {},

  graph_data: {
    tree: {
      nodeName: 'Start',
      name: 'Start',
      type: 'type3',
      code: 'N1',
      label: 'Start',
      version: 'v1.0',
      description: 'Scheme entry point',
      // link: {
      //   name: 'Link NODE NAME 1',
      //   nodeName: 'NODE NAME 1',
      //   direction: 'ASYN',
      // },
      // children: [
      //   {
      //     nodeName: 'NODE NAME 2.1',
      //     name: 'NODE NAME 2.1',
      //     type: 'type1',
      //     code: 'N2.1',
      //     label: 'Node name 2.1',
      //     version: 'v1.0',
      //     link: {
      //       name: 'Link node 1 to 2.1',
      //       nodeName: 'NODE NAME 2.1',
      //       direction: 'SYNC',
      //     },
      //     children: [
      //       {
      //         nodeName: 'NODE NAME 3.1',
      //         name: 'NODE NAME 3.1',
      //         type: 'type2',
      //         code: 'N3.1',
      //         label: 'Node name 3.1',
      //         version: 'v1.0',
      //         link: {
      //           name: 'Link node 2.1 to 3.1',
      //           nodeName: 'NODE NAME 3.1',
      //           direction: 'SYNC',
      //         },
      //         children: [],
      //       },
      //       {
      //         nodeName: 'NODE NAME 3.2',
      //         name: 'NODE NAME 3.2',
      //         type: 'type2',
      //         code: 'N3.2',
      //         label: 'Node name 3.2',
      //         version: 'v1.0',
      //         link: {
      //           name: 'Link node 2.1 to 3.2',
      //           nodeName: 'NODE NAME 3.1',
      //           direction: 'SYNC',
      //         },
      //         children: [],
      //       },
      //     ],
      //   },
      //   {
      //     nodeName: 'NODE NAME 2.2',
      //     name: 'NODE NAME 2.2',
      //     type: 'type1',
      //     code: 'N2.2',
      //     label: 'Node name 2.2',
      //     version: 'v1.0',
      //     link: {
      //       name: 'Link node 1 to 2.2',
      //       nodeName: 'NODE NAME 2.2',
      //       direction: 'ASYN',
      //     },
      //     children: [],
      //   },
      //   {
      //     nodeName: 'NODE NAME 2.3',
      //     name: 'NODE NAME 2.3',
      //     type: 'type1',
      //     code: 'N2.3',
      //     label: 'Node name 2.3',
      //     version: 'v1.0',
      //     link: {
      //       name: 'Link node 1 to 2.3',
      //       nodeName: 'NODE NAME 2.3',
      //       direction: 'ASYN',
      //     },
      //     children: [
      //       {
      //         nodeName: 'NODE NAME 3.3',
      //         name: 'NODE NAME 3.3',
      //         type: 'type1',
      //         code: 'N3.3',
      //         label: 'Node name 3.3',
      //         version: 'v1.0',
      //         link: {
      //           name: 'Link node 2.3 to 3.3',
      //           nodeName: 'NODE NAME 3.3',
      //           direction: 'ASYN',
      //         },
      //         children: [
      //           {
      //             nodeName: 'NODE NAME 4.1',
      //             name: 'NODE NAME 4.1',
      //             type: 'type4',
      //             code: 'N4.1',
      //             label: 'Node name 4.1',
      //             version: 'v1.0',
      //             link: {
      //               name: 'Link node 3.3 to 4.1',
      //               nodeName: 'NODE NAME 4.1',
      //               direction: 'SYNC',
      //             },
      //             children: [],
      //           },
      //         ],
      //       },
      //       {
      //         nodeName: 'NODE NAME 3.4',
      //         name: 'NODE NAME 3.4',
      //         type: 'type1',
      //         code: 'N3.4',
      //         label: 'Node name 3.4',
      //         version: 'v1.0',
      //         link: {
      //           name: 'Link node 2.3 to 3.4',
      //           nodeName: 'NODE NAME 3.4',
      //           direction: 'ASYN',
      //         },
      //         children: [
      //           {
      //             nodeName: 'NODE NAME 4.2',
      //             name: 'NODE NAME 4.2',
      //             type: 'type4',
      //             code: 'N4.2',
      //             label: 'Node name 4.2',
      //             version: 'v1.0',
      //             link: {
      //               name: 'Link node 3.4 to 4.2',
      //               nodeName: 'NODE NAME 4.1',
      //               direction: 'ASYN',
      //             },
      //             children: [],
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ],
    },
  },

  // -------------------------------------------------------------
  // Constructor & Destructor functions
  // -------------------------------------------------------------

  _create: function () {
    this._super();
    this._declareLocalVariables();
    this._initHTMLPointers();
    //this._insertHtml(); // this._super inserts HTML when inheriting app2widget
    //this._setPointers();

    return this;
  },

  _declareLocalVariables: function () {
    this._commandList = {
      workflow_engine_init: { widgetCommand: 'workflow_engine_init' },
      workflow_engine_add_node: { widgetCommand: 'workflow_engine_add_node' },
      graph_save_config: { widgetCommand: 'save-graph-config' },
      graph_delete_config: { widgetCommand: 'delete-graph-config' },
      graph_refresh: { widgetCommand: 'graph_refresh' },
      graph_ticket_type_select: { widgetCommand: 'graph_update_data' },
    };
  },

  _destroyEvents: function () {
    mdtLogger.log(this, '_destroyEvents');

    //this.contextMenuOptions.menuVariables.togglenodes.removeEventListener(
    //    'click',
    //    this.contextMenuOptions.toggleIsolatedNodes
    //);
    //this.contextMenuOptions.menuVariables.centergraph.removeEventListener(
    //    'click',
    //    this.centerGraph
    //);
    //$(this._controls.graph_filter).find('a.workflow_graph_refresh').unbind();
    //$(this._controls.graph_filter)
    //    .find('a.workflow_graph_filters_edit')
    //    .unbind();
    //$(this._controls.graph_filter)
    //    .find('a.workflow_graph_filters_reset')
    //    .unbind();
    //$('.graph-gui .graph-filter-list').find('.filters-apply').unbind();
    //$('.graph-gui .graph-filter-list').find('.filters-cancel').unbind();
    //$(this._controls.graph_filter)
    //    .find('a.workflow_graph_legend_btn')
    //    .unbind();
  },

  _destroyHTML: function () {
    mdtLogger.log(this, '_destroyHTML');

    //if (cyWorkflow != null) {
    //    cyWorkflow.destroy();
    //    cyWorkflow = null;
    //}
  },

  _destroyPointers: function () {
    mdtLogger.log(this, '_destroyPointers');

    //this.options.filter = null;
    //this.options.ticketStatuses = null;
    //this.options.savedConfigs = null;
    //this.options.selectedType = null;
    //this.options.graphFilters = null;
    //this.options.graphFiltersList = null;
    //this.options.ticketTypesList = null;
    //this.options.last_graph_id = null;
    //this.options.selectGraphObj = null;
    //this.options.positions = null;
  },

  _dialogOptionsSet: function (title) {
    var self = this;
    if (
      self.options.addNodeDialog &&
      typeof self.options.addNodeDialog !== 'undefined'
    ) {
      self.options.addNodeDialog.dialog('option', 'title', title);

      if (self.options.addNodeDialog.parent().length != 0) {
        self.options.addNodeDialog
          .parent()
          .draggable({ containment: '.d3-container.tree-container' }); //containment
      }
    }
  },

  _destroy: function () {
    this._isDisposing = true;
    mdtLogger.log(this, '_destroy', 'graphWidget');

    this._destroyEvents();
    this._destroyHTML();
    this._destroyPointers();

    mdtLogger.log(this, '_destroy', '_super');
    this._super();
  },

  _init: function () {
    mdtLogger.log(this, '_init');
    var self = this;

    //d3.json('data-example.json', function (error, json) {
    self.treeBoxes('', self.graph_data.tree);
    //});

    //setTimeout(() => self._initAddNodeDialog(), 3000);

    // init html interface request
    //this._request(null, self._commandList.workflow_engine_add_node);

    return this;
  },

  _initHTMLPointers: function () {
    this._initAddNodeDialog();
    this._initTreeContainer();
    this._initNewNodeDialog();
    this._initAddNewNodeButton();
  },

  _initTreeContainer: function () {
    var self = this;

    if (
      !self.options.treeContainer ||
      typeof self.options.treeContainer === 'undefined'
    ) {
      var container = $(self._templates.currentWidget).find('.tree-container');

      if (container.length == 1) {
        self.options.treeContainer = container;
      }
    }
  },

  _initAddNodeDialog: function () {
    var self = this;

    if (!self.options.addNodeDialog || self.options.addNodeDialog.length == 0) {
      {
        var workflowEngineContainer = $(self._templates.addNodeDialog);

        if (workflowEngineContainer.length == 1)
          self.options.addNodeDialog = workflowEngineContainer;
      }
    }

    return;
  },

  _initNewNodeDialog: function () {
    var self = this;

    if (!self.options.newNodeDialog || self.options.newNodeDialog.length == 0) {
      var newNodeDialogContainer = $(document)
        .find('.workflow-engine-dialog.workfow-engine-designer-nodetypes')
        .droppable({
          drop: function (event, ui) {
            if (typeof self.options.droppedInsideContainer !== 'undefined') {
              self.options.droppedInsideContainer = true;
            }
          },
        });

      if (newNodeDialogContainer.length == 1) {
        self.options.newNodeDialog = newNodeDialogContainer;
      }

      self.appendNodeType('node-start');
      self.appendNodeType('node-message');
    }
  },

  _initAddNewNodeButton: function () {
    var self = this;

    if (!self.options.newNodeButton || self.options.newNodeButton.length == 0) {
      var newNodeButton = $(self._templates.currentWidget).find(
        'div.workflow-engine-designer-nodetypes.svg-wrapper'
      );
      //.off();

      if (newNodeButton.length == 1) {
        self.options.newNodeButton = newNodeButton;
      }
    }
  },

  appendNodeType: function (nodeTypeName) {
    var self = this;
    var elementCard = `<div class = "element-card-wrapper element-card-wrapper-${nodeTypeName}">\
                          <element-card nodetypename = ${nodeTypeName}\
                            class = "element-card-reusable element-card-${nodeTypeName}">\
                          </element-card>\
                       </div>`;

    var formBody = $(
      '.workflow-engine-dialog-body .node-types-form',
      this.element
    );

    if (formBody.length == 1) formBody.append(elementCard);

    $(`.element-card-wrapper-${nodeTypeName}`).draggable({
      revert: true,
      revertDuration: 50,
      containment: '.d3-container.tree-container',
    });
  },

  _insertHtml: function () {
    $(this._templates.currentWidget).appendTo(this.element);
  },

  displayNewNodeDialog: function () {
    var self = this;

    var newNodeDialog = $(
      '.workflow-engine-dialog.workfow-engine-designer-nodetypes'
    );
    newNodeDialog.css('display', 'block');

    self.options.newNodeDialog = newNodeDialog;

    self.options.newNodeDialog.draggable({
      containment: '.d3-container.tree-container',
      revert: false,
    });

    self.options.newNodeDialog
      .find('span.workflow-engine-designer_closethick')
      .off()
      .on('click', function () {
        self.options.newNodeDialog.css('display', 'none');
      });
  },

  _request: function (request, header, async, callback) {
    if (!this._isAlive()) return;
    var reqObj = {};
    switch (header['widgetCommand']) {
      // case this._commandList.graph_ticket_type_select:
      //   reqObj['ticketType'] = header['ticketType'];
      //   reqObj['filters'] = header['filters'];

      //   this._super(reqObj, this._commandList.graph_ticket_type_select);

      //   reqObj = null;
      //   break;

      // case this._commandList.graph_save_config:
      //   reqObj = header['request'];
      //   this._super(reqObj, this._commandList.graph_save_config);

      //   reqObj = null;
      //   break;

      // case this._commandList.graph_delete_config:
      //   reqObj = header['request'];
      //   this._super(reqObj, this._commandList.graph_delete_config);

      //   reqObj = null;
      //   break;

      default:
        this._super(request, header, async, callback);
        break;
    }
  },

  // #region MAIN ENTRY POINT
  treeBoxes: function (urlService, jsonData) {
    var self = this;
    var urlService_ = '';

    var blue = '#007FFF',
      green = '#5cb85c',
      orange = '#f0ad4e',
      blueText = '#4ab1eb',
      purple = '#9467bd';
    darkGreen = '#155341';

    var leftBound = 50;
    var margin = {
        top: 0,
        right: 0,
        bottom: 100,
        left: 0,
      },
      // Height and width are redefined later in function of the size of the tree
      // (after that the data are loaded)
      width = 800 - margin.right - margin.left,
      height = 400 - margin.top - margin.bottom;

    var rectNode = { width: 120, height: 45, textMargin: 5 },
      tooltip = { width: 150, height: 40, textMargin: 5 };
    var i = 0,
      duration = 750,
      root;

    var mousedown; // Use to save temporarily 'mousedown.zoom' value
    var mouseWheel,
      mouseWheelName,
      isKeydownZoom = false,
      mousePosition = {},
      clickTarget = '';

    var tree;
    var nodeGroup, // If nodes are not grouped together, after a click the svg node will be set after his corresponding tooltip and will hide it
      nodeGroupTooltip,
      linkGroup,
      linkGroupToolTip,
      defs,
      currentParrentNode = {},
      currentChildNode = {};
    currentNode = {};

    var drawAreaTranslation = [0, 0];
    var drawAreaScale = 1;

    var linkMouseXCorrection = 6,
      linkMouseYCorrection = 8;

    initializeD3(urlService, jsonData);
    //initSelect2();
    //initModal();

    self.initContextMenuEvents();
    self.initDOMEventListeners();
    addDropEventToContainer();
    addDblClickEventToNodeCard();

    function initializeD3(urlService, jsonData) {
      urlService_ = urlService;
      if (urlService && urlService.length > 0) {
        if (urlService.charAt(urlService.length - 1) != '/') urlService_ += '/';
      }

      if (jsonData) drawTree(jsonData);
      else {
        console.error(jsonData);
        alert('Invalid data.');
      }
    }

    function addDropEventToContainer() {
      $('.d3-container.tree-container').droppable({
        drop: function (event, ui) {
          if (typeof ui.draggable !== 'undefined' && ui.draggable.length >= 1) {
            if (
              ui.draggable.hasClass('element-card-wrapper') &&
              !self.options.droppedInsideContainer
            ) {
              var translateValues = {
                top: ui.offset.top - self.options.d3ContainerBoundingClient.y,
                left: ui.offset.left - self.options.d3ContainerBoundingClient.x,
              };
              addNewSpareNode(ui.draggable[0].outerText, translateValues);
            }

            self.options.droppedInsideContainer = false;
          }
        },
      });
    }

    function addDblClickEventToNodeCard() {
      $('.element-card-wrapper', this.element).dblclick(function (eventData) {
        addNewSpareNode(eventData.currentTarget.outerText, { top: 0, left: 0 });
      });
    }

    //TO DO

    // Dialog component
    // Resizable nodes
    // multiple layouts for scripts

    function drawTree(jsonData) {
      tree = d3.layout.tree().size([height, width]);
      root = jsonData;
      root.fixed = true;

      // Dynamically set the height of the main svg container
      // breadthFirstTraversal returns the max number of node on a same level
      // and colors the nodes
      var maxDepth = 0;
      var maxTreeWidth = breadthFirstTraversal(
        tree.nodes(root),

        function (currentLevel) {
          maxDepth++;
          currentLevel.forEach(function (node) {
            if (node.type == 'type1') node.color = blue;
            if (node.type == 'type2') node.color = green;
            if (node.type == 'type3') node.color = orange;
            if (node.type == 'type4') node.color = purple;
          });
        }
      );

      if (typeof self.options.d3ContainerBoundingClient !== 'undefined') {
        self.options.d3ContainerBoundingClient = d3
          .select('#tree-container')
          .node()
          .getBoundingClientRect();
      }
      // height =
      //   maxTreeWidth * (rectNode.height + 20) +
      //   tooltip.height +
      //   20 -
      //   margin.right -
      //   margin.left;
      // width =
      //   maxDepth * (rectNode.width * 1.5) +
      //   tooltip.width / 2 -
      //   margin.top -
      //   margin.bottom;

      //root.x0 = height / 2;
      root.y0 = 0;

      self.options.d3Zoom = d3
        .zoom()
        // .extent([
        //   [0, 0],
        //   [
        //     width + margin.right + margin.left,
        //     height + margin.top + margin.bottom,
        //   ],
        // ])
        .scaleExtent([0.5, 3]) // Limit the zoom scale
        .on('zoom', zoomAndScale);
      //.on('zoomend', zoomEnd);

      self.options.baseSvg = d3
        .select('#tree-container')
        .append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'svgContainer')
        .classed('svg-content-responsive', true)
        .call(self.options.d3Zoom);
      // .call(
      //   d3.behavior
      //     .drag()
      //     .on('dragstart', dragStart)
      //     .on('drag', drag)
      //     .on('dragend', dragEnd)
      // )
      // .on('mousedown', onMouseDown);

      // set root x0 coordinate according to the container size
      root.x0 =
        (parseInt(self.options.baseSvg.style('height'), 10) || height) / 2;

      // Mouse wheel is desactivated, else after a first drag of the tree, wheel event drags the tree (instead of scrolling the window)
      getMouseWheelEvent();
      //d3.select('#tree-container').select('svg').on(mouseWheelName, null);
      //d3.select('#tree-container').select('svg').on('dblclick.zoom', null);

      self.options.svgGroup = self.options.baseSvg
        .append('g')
        .attr('class', 'drawarea')
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      d3.select('.drawarea').attr('transform', function (d) {
        return 'translate(' + leftBound + ',' + 0 + ')';
      });

      //debugger;
      height = self.options.d3ContainerBoundingClient.height;
      width = self.options.d3ContainerBoundingClient.width;

      tree = d3.layout.tree().size([height, width]);

      // SVG elements under nodeGroupTooltip could be associated with nodeGroup,
      // same for linkGroupToolTip and linkGroup,
      // but this separation allows to manage the order on which elements are drew
      // and so tooltips are always on top.
      nodeGroup = self.options.svgGroup.append('g').attr('id', 'nodes');
      linkGroup = self.options.svgGroup.append('g').attr('id', 'links');
      linkGroupToolTip = self.options.svgGroup
        .append('g')
        .attr('id', 'linksTooltips');
      nodeGroupTooltip = self.options.svgGroup
        .append('g')
        .attr('id', 'nodesTooltips');

      defs = self.options.baseSvg.append('defs');
      initArrowDef();
      initDropShadow();

      update(root, self.options.updateType.DefaultLayout);

      setTimeout(() => {
        zoomAndScale();
      }, duration);
    }

    function update(source, updateType) {
      structuredData = source;
      var nodeEnterToolTipSVGDimension = 23; // svg in px

      // all the functions defined are wrapped in the same update function as we want to interact with the graph and
      //with every interaction we want to update it
      // Compute the new tree layout
      var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

      // console.log("Nodes: \n" + tree.nodes(root) + "\n");
      // console.log("Edges: \n" + tree.links(nodes));

      // Check if two nodes are in collision on the ordinates axe and move them
      breadthFirstTraversal(tree.nodes(root), collision);
      // Normalize for fixed-depth
      nodes.forEach(function (d) {
        d.y = d.depth * (rectNode.width * 1.5);
        // console.log(d);
      });

      //#region NODE-UPDATE

      // 1) ******************* Update the nodes *******************
      var node = nodeGroup.selectAll('g.node').data(nodes, function (d) {
        return d.id || (d.id = ++i);
      });

      var nodesTooltip = nodeGroupTooltip
        .selectAll('g')
        .data(nodes, function (d) {
          return d.id || (d.id = ++i);
        });

      // Enter any new nodes at the parent's previous position
      // We use "insert" rather than "append", so when a new child node is added (after a click)
      // it is added at the top of the group, so it is drawed first
      // else the nodes tooltips are drawed before their children nodes and they
      // hide them

      //we want the nodes to start at the parents position and then transition

      //#region NODE-ENTER

      var nodeEnter = node
        .enter()
        .insert('g', 'g.node')
        .attr('class', 'node')
        .attr('id', function (d) {
          return `${d.nodeName + d.id}`;
        })

        .attr('transform', function (d) {
          return 'translate(' + source.y0 + ',' + source.x0 + ')';
        })

        .on('click', function (d) {
          click(d);
        })
        .on('dblclick', function (d) {
          // d3.selectAll('g.node')
          //   .append('circle')
          //   .attr('r', 10)
          //   .attr('cx', 100)
          //   .attr('cy', 20)
          //   .style('stroke', 'gray')
          //   .style('fill', (d) => {
          //     return 'orange';
          //   });
          // updateSourceData();
        });

      //we want the tooltips to start at the parents position and then transition along with the nodes they belong to

      var nodeEnterTooltip = nodesTooltip
        .enter()
        .append('g')
        .attr('transform', function (d) {
          return 'translate(' + source.y0 + ',' + source.x0 + ')';
        });

      nodeEnter
        .append('g')
        .append('rect')
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('width', rectNode.width)
        .attr('height', rectNode.height)
        .attr('class', 'node-rect')
        .attr('fill', function (d) {
          return d.color;
        })
        .attr('filter', 'url(#drop-shadow)')
        .on('mouseover', function (d) {
          $('#nodeInfoID' + d.id).css('visibility', 'visible');
          $('#nodeInfoTextID' + d.id).css('visibility', 'visible');
          $('#nodeExpandId' + d.id).css('visibility', 'visible');
          $('#nodeDeleteId' + d.id).css('visibility', 'visible');
        })
        .on('mouseout', function (d) {
          $('#nodeInfoID' + d.id).css('visibility', 'hidden');
          $('#nodeInfoTextID' + d.id).css('visibility', 'hidden');
          $('#nodeExpandId' + d.id).css('visibility', 'hidden');
          $('#nodeDeleteId' + d.id).css('visibility', 'hidden');
        });

      // nodeEnter
      //   .append("foreignObject")
      //   .attr("x", rectNode.textMargin)
      //   .attr("y", rectNode.textMargin)
      //   .attr("width", function () {
      //     return rectNode.width - rectNode.textMargin * 2 < 0
      //       ? 0
      //       : rectNode.width - rectNode.textMargin * 2;
      //   })
      //   .attr("height", function () {
      //     return rectNode.height - rectNode.textMargin * 2 < 0
      //       ? 0
      //       : rectNode.height - rectNode.textMargin * 2;
      //   })
      //   .append("xhtml")
      //   .html(function (d) {
      //     return (
      //       '<div style="width: ' +
      //       (rectNode.width - rectNode.textMargin * 2) +
      //       "px; height: " +
      //       (rectNode.height - rectNode.textMargin * 2) +
      //       'px;" class="node-text wordwrap">' +
      //       "<b>" +
      //       d.nodeName +
      //       "</b><br><br>" +
      //       "<b>Code: </b>" +
      //       d.code +
      //       "<br>" +
      //       "<b>Version: </b>" +
      //       d.version +
      //       "<br>" +
      //       "</div>"
      //     );
      //   })
      //   .on("mouseover", function (d) {
      //     //$("#nodeInfoID" + d.id).css("visibility", "visible");
      //     //$("#nodeInfoTextID" + d.id).css("visibility", "visible");
      //     $("#nodeExpandId" + d.id).css("visibility", "visible");
      //     // $(".svgContainer").append('<i class="bi bi-plus-circle"></i>');
      //     // $(".svgContainer").append("i").class("bi bi-plus-circle");
      //   })
      //   .on("mouseout", function (d) {
      //     // $("#nodeInfoID" + d.id).css("visibility", "hidden");
      //     // $("#nodeInfoTextID" + d.id).css("visibility", "hidden");
      //     $("#nodeExpandId" + d.id).css("visibility", "hidden");
      //   });

      //#endregion

      //#region NODE-ENTER-TOOLTIP

      nodeEnterTooltip
        .append('svg:foreignObject')
        .attr('id', function (d) {
          return 'nodeExpandId' + d.id;
        })
        .attr('width', nodeEnterToolTipSVGDimension)
        .attr('height', nodeEnterToolTipSVGDimension)
        .attr('x', rectNode.width - nodeEnterToolTipSVGDimension + 1)
        .attr('y', 0)
        .attr('class', 'tooltip-node-add')
        // .attr('transform', function (d) {
        //   return 'scale(' + nodeTooltipScale + ')';
        // })
        .append('xhtml:div')
        .html('<svg class="bi bi-node-plus-fill"></svg>')
        .on('click', function (d) {
          //self._request(null, self._commandList.workflow_engine_add_node);
          clickTarget = 'node';
          currentParrentNode = d;
          if (self.options.addNodeDialog) {
            self.options.addNodeDialog.dialog({
              appendTo: '#tree-container',
              resizable: false,
              //draggable: false,
              height: 'auto',
              width: 'auto',
              modal: true,
              buttons: {
                'Add node': function () {
                  var newItem = [
                    {
                      nodeName: 'Test',
                      name: 'Test',
                      type: 'type1',
                      code: 'N4.3',
                      label: 'Test',
                      description: `New Child Node ${d.id + 1}`,
                      version: 'v1.0',
                      link: {
                        name: 'Link node 3.4 to 4.2',
                        nodeName: 'NODE NAME 4.1',
                        direction: 'ASYN',
                      },
                      children: [],
                      addMode: self.options.nodeAddMode.Auto,
                    },
                  ];
                  newItem[0].color = currentParrentNode.color;

                  //if (clickTarget.indexOf('node') != -1) {
                  addNewChildNode(currentParrentNode, newItem);
                  //} else if (clickTarget.indexOf('edge') != '-1') {
                  // addNewInBetweenNode(
                  //   currentParrentNode,
                  //   currentChildNode,
                  //   newItem
                  // );
                  //}

                  $(this).dialog('close');
                  update(root, self.options.updateType.DefaultLayout);
                },
                Cancel: function () {
                  $(this).dialog('close');
                },
              },
            });

            self._dialogOptionsSet('Add Node?');
          }
          //$('.newNodeModalContainer').modal('show');
        })
        .on('mouseover', function (d) {
          //$("#nodeInfoID" + d.id).css("visibility", "visible");
          //$("#nodeInfoTextID" + d.id).css("visibility", "visible");
          // nodeEnter.append("text").text(function (d) {
          //   return "Name: " + d.name;
          // });
          $('#nodeExpandId' + d.id).css('visibility', 'visible');
          $('#nodeDeleteId' + d.id).css('visibility', 'visible');

          removeMouseEvents();
        })
        .on('mouseout', function (d) {
          //$("#nodeInfoID" + d.id).css("visibility", "hidden");
          //$("#nodeInfoTextID" + d.id).css("visibility", "hidden");
          $('#nodeExpandId' + d.id).css('visibility', 'hidden');
          $('#nodeDeleteId' + d.id).css('visibility', 'hidden');

          reactivateMouseEvents();
        });

      nodeEnterTooltip // filter root node from having 'delete node' button displayed
        .filter(function (d) {
          return d.parent;
        })
        .append('svg:foreignObject')
        .attr('id', function (d) {
          return 'nodeDeleteId' + d.id;
        })
        .attr('width', nodeEnterToolTipSVGDimension)
        .attr('height', nodeEnterToolTipSVGDimension)
        .attr('x', 0)
        .attr('y', 0)
        .attr('class', 'tooltip-node-delete')
        // .attr('transform', function (d) {
        //   return 'scale(' + nodeTooltipScale + ')';
        // })
        .append('xhtml:div')
        .html('<svg class="bi bi-x-circle-fill"></svg>')
        .on('click', function (d) {
          //self._request(null, self._commandList.workflow_engine_add_node);
          clickTarget = 'node';
          currentNode = d;
          var isLeafNode = false;
          var removeNodeButtons = {};

          if (typeof d.children === 'undefined') isLeafNode = true;
          removeNodeButtons = _dialogRemoveNodeButtonsSet(
            currentNode,
            isLeafNode
          );

          if (self.options.addNodeDialog) {
            self.options.addNodeDialog.dialog({
              appendTo: '#tree-container',
              resizable: false,
              //draggable: false,
              height: 'auto',
              width: 'auto',
              modal: true,
              buttons: removeNodeButtons,
            });

            self._dialogOptionsSet('Delete node?');
          }
          //$('.newNodeModalContainer').modal('show');
        })
        .on('mouseover', function (d) {
          //$("#nodeInfoID" + d.id).css("visibility", "visible");
          //$("#nodeInfoTextID" + d.id).css("visibility", "visible");
          // nodeEnter.append("text").text(function (d) {
          //   return "Name: " + d.name;
          // });

          $('#nodeExpandId' + d.id).css('visibility', 'visible');
          $('#nodeDeleteId' + d.id).css('visibility', 'visible');

          removeMouseEvents();
        })
        .on('mouseout', function (d) {
          //$("#nodeInfoID" + d.id).css("visibility", "hidden");
          //$("#nodeInfoTextID" + d.id).css("visibility", "hidden");

          $('#nodeExpandId' + d.id).css('visibility', 'hidden');
          $('#nodeDeleteId' + d.id).css('visibility', 'hidden');

          reactivateMouseEvents();
        });

      //#region NODE-TOOLTIP-BOX

      nodeEnterTooltip
        .on('mouseover', function (d) {
          //$("#nodeInfoID" + d.id).css("visibility", "visible");
          //$("#nodeInfoTextID" + d.id).css("visibility", "visible");
          // nodeEnter.append("text").text(function (d) {
          //   return "Name: " + d.name;
          // });
          $('#nodeExpandId' + d.id).css('visibility', 'visible');
          $('#nodeDeleteId' + d.id).css('visibility', 'visible');

          removeMouseEvents();
        })
        .on('mouseout', function (d) {
          // $('#nodeInfoID' + d.id).css('visibility', 'hidden');
          // $('#nodeInfoTextID' + d.id).css('visibility', 'hidden');
          $('#nodeExpandId' + d.id).css('visibility', 'hidden');
          $('#nodeDeleteId' + d.id).css('visibility', 'hidden');

          reactivateMouseEvents();
        })
        .append('rect')
        .attr('id', function (d) {
          return 'nodeInfoID' + d.id;
        })
        .attr('x', 0)
        .attr('y', -rectNode.height)
        .attr('width', tooltip.width)
        .attr('height', tooltip.height)
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('filter', 'url(#drop-shadow)')
        .attr('class', 'tooltip-box');
      //.attr('fill', 'lightsteelblue')
      //.style('fill-opacity', 0.9)

      //#endregion

      //#region NODE-TOOLTIP-TEXT

      nodeEnterTooltip
        .append('text')
        .attr('id', function (d) {
          return 'nodeInfoTextID' + d.id;
        })
        .attr('x', 0 + tooltip.textMargin) //rectNode.width / 2 + tooltip.textMargin
        .attr('y', -rectNode.height + tooltip.textMargin * 3) //rectNode.height / 2 + tooltip.textMargin * 3
        .attr('width', tooltip.width)
        .attr('height', tooltip.height)
        .attr('class', 'tooltip-text')
        .append('tspan')
        .text(function (d) {
          return 'Node type: ' + d.label;
        })
        .append('tspan')
        .attr('x', 0 + tooltip.textMargin) //rectNode.width / 2 + tooltip.textMargin
        .attr('dy', '1.5em')
        .text(function (d) {
          return 'Info: ' + d.description;
        });

      //#endregion

      //#endregion

      // Transition nodes to their new position.

      // A transition is a selection-like interface for animating changes to the DOM.
      //Instead of applying changes instantaneously, transitions smoothly interpolate the DOM from its current state
      //to the desired target state over a given duration

      try {
        var nodeUpdate, nodeX, nodeY;

        //#region NODE-UPDATE + NODE-UPDATE-TOOLTIP

        applyTranslateValues(nodeEnter, nodeEnterTooltip);

        nodeUpdate = nodeEnter.merge(node);

        nodeUpdate
          .transition()
          .attr('duration', function (d) {
            // return !d.hasOwnProperty('addMode') ||
            //   d.addMode === self.options.nodeAddMode.Auto
            //   ? duration
            //   : 0;
            if (
              !d.hasOwnProperty('addMode') ||
              d.addMode === self.options.nodeAddMode.Auto
            )
              return duration;
            else {
              if (d.hasOwnProperty('translateValues')) return 0;
            }
          })
          .attr('transform', function (d) {
            if (
              !d.hasOwnProperty('addMode') ||
              d.addMode === self.options.nodeAddMode.Auto
            )
              return 'translate(' + d.y + ',' + d.x + ')';
            else {
              if (d.hasOwnProperty('translateValues'))
                return (
                  'translate(' +
                  d.translateValues.left +
                  ',' +
                  d.translateValues.top +
                  ')'
                );
            }
          });

        nodesTooltip = nodeEnterTooltip.merge(nodesTooltip);

        nodesTooltip
          .transition()
          .attr('duration', function (d) {
            if (
              !d.hasOwnProperty('addMode') ||
              d.addMode === self.options.nodeAddMode.Auto
            )
              return duration;
            else {
              if (d.hasOwnProperty('translateValues')) return 0;
            }
          })
          .attr('transform', function (d) {
            if (
              !d.hasOwnProperty('addMode') ||
              d.addMode === self.options.nodeAddMode.Auto
            )
              return 'translate(' + d.y + ',' + d.x + ')';
            else {
              if (d.hasOwnProperty('translateValues'))
                return (
                  'translate(' +
                  d.translateValues.left +
                  ',' +
                  d.translateValues.top +
                  ')'
                );
            }
          });
      } catch (ex) {
        console.log(ex.message);
      }

      nodeUpdate.select('rect').attr('class', function (d) {
        return d._children ? 'node-rect-closed' : 'node-rect';
      });

      nodeUpdate.select('text').style('fill-opacity', 1);

      //#endregion

      //#region NODE-EXIT

      //Transition exiting nodes to the parent's new position (removing the nodes)
      var nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + source.y + ',' + source.x + ')';
        })
        .remove();

      nodesTooltip
        .exit()
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + source.y + ',' + source.x + ')';
        })
        .remove();

      nodeExit.select('text').style('fill-opacity', 1e-6);

      //#endregion

      //#endregion

      //#region EDGE-UPDATE

      // 2) ******************* Update the links *******************
      var link = linkGroup.selectAll('path').data(links, function (d) {
        return d.target.id;
      });
      var linkTooltip = linkGroupToolTip
        .selectAll('g')
        .data(links, function (d) {
          return d.target.id;
        });

      function linkMarkerStart(direction, isSelected) {
        if (direction == 'SYNC') {
          return isSelected
            ? 'url(#start-arrow-selected)'
            : 'url(#start-arrow)';
        }
        return '';
      }

      function linkType(link) {
        if (link.direction == 'SYNC') return 'Synchronous [\u2194]';
        else {
          if (link.direction == 'ASYN') return 'Asynchronous [\u2192]';
        }
        return '???';
      }

      d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
          this.parentNode.appendChild(this);
        });
      };

      // Enter any new links at the parent's previous position.

      var linkenter = link
        .enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('id', function (d) {
          return 'linkID' + d.target.id;
        })
        .attr('d', function (d) {
          //d is the parameter that defines the path
          //return diagonal(d);
          if (d.target === self.options.lastChildAdded[0])
            if (updateType === self.options.updateType.DragDrop) {
              console.log('Drop Node');
              return;
            }
          return diagonal(d);
        })
        .attr('marker-end', 'url(#end-arrow)')
        .attr('marker-start', function (d) {
          return linkMarkerStart(d.target.link.direction, false);
        })
        .on('mouseover', function (d) {
          d3.select(this).moveToFront();
          d3.select(this).attr('marker-end', 'url(#end-arrow-selected)');
          d3.select(this).attr(
            'marker-start',
            linkMarkerStart(d.target.link.direction, true)
          );
          d3.select(this).attr('class', 'linkselected');

          mousePosition.x = d3.event.offsetX;
          mousePosition.y = d3.event.offsetY;

          if (
            typeof drawAreaTranslation !== 'undefined' &&
            typeof drawAreaScale !== 'undefined' &&
            drawAreaScale != 0
          )
            try {
              mousePosition.x =
                (d3.event.offsetX - drawAreaTranslation[0]) / drawAreaScale;
              mousePosition.y =
                (d3.event.offsetY - drawAreaTranslation[1]) / drawAreaScale;
            } catch (ex) {
              console.log('Linkenter mouseposition' + ex.message);
            }

          $('#linkExpandId' + d.target.id).attr('x', function () {
            // d = d3.select(this).data()[0];
            if (typeof mousePosition.x !== 'undefined') {
              //"";
              return mousePosition.x - linkMouseXCorrection;
            }
            return (d.target.y + rectNode.width - d.source.y) / 2 + d.source.y;
          });

          $('#linkExpandId' + d.target.id).attr('y', function () {
            // d = d3.select(this).data()[0];
            if (typeof mousePosition.y !== 'undefined') {
              return mousePosition.y - linkMouseYCorrection;
            }
            return (d.target.y + rectNode.width - d.source.y) / 2 + d.source.y;
          });

          //  $("#tooltipLinkID" + d.target.id).attr("x", function (d) {
          //    if (typeof mousePosition.x !== "undefined") return mousePosition.x;
          //    return (d.target.y + rectNode.width - d.source.y) / 2 + d.source.y;
          //  });
          //  $("#tooltipLinkID" + d.target.id).attr(
          //    "y",
          //    (d.target.x - d.source.x) / 2 + d.source.x
          //  );

          $('#tooltipLinkID' + d.target.id).css('visibility', 'visible');
          $('#tooltipLinkTextID' + d.target.id).css('visibility', 'visible');
          $('#linkExpandId' + d.target.id).css('visibility', 'visible');
        })
        .on('mouseout', function (d) {
          d3.select(this).attr('marker-end', 'url(#end-arrow)');
          d3.select(this).attr(
            'marker-start',
            linkMarkerStart(d.target.link.direction, false)
          );
          d3.select(this).attr('class', 'link');
          $('#tooltipLinkID' + d.target.id).css('visibility', 'hidden');
          $('#tooltipLinkTextID' + d.target.id).css('visibility', 'hidden');
          $('#linkExpandId' + d.target.id).css('visibility', 'hidden');
        });

      var linkEnterTooltip = linkTooltip
        .enter()
        .append('g')
        .attr('transform', function (d) {
          //"";
          //return "translate(" + source.y0 + "," + source.x0 + ")";
        });

      linkEnterTooltip
        .append('svg:foreignObject')
        .attr('id', function (d) {
          return 'linkExpandId' + d.target.id;
        })
        .attr('x', function (d) {
          return 0;
        })
        .attr('y', function (d) {
          return 0; //d.target.x - d.source.x;
        })
        .attr('transform', function (d) {
          return;
          // return "translate(" + -source.y0 + "," + -source.x0 + ")";
        })
        .attr('class', 'tooltip-link-add')
        .append('xhtml:body')
        .html('<i class="bi bi-plus-circle-fill"></i>')
        .on('click', function (d) {
          //self._request(null, self._commandList.workflow_engine_add_node);

          clickTarget = 'edge';
          if (d.source) {
            currentParrentNode = d.source;
          }
          if (d.target) {
            currentChildNode = d.target;
          }

          var addNodeButtons = _dialogAddNodeButtonsSet();

          if (self.options.addNodeDialog) {
            self.options.addNodeDialog.dialog({
              resizable: false,
              height: 'auto',
              width: 'auto',
              modal: true,
              buttons: addNodeButtons,
            });

            self._dialogOptionsSet('Add Node?');
          }
        })
        .on('mouseover', function (d) {
          $('#tooltipLinkID' + d.target.id).css('visibility', 'visible');
          $('#tooltipLinkTextID' + d.target.id).css('visibility', 'visible');
          $('#linkExpandId' + d.target.id).css('visibility', 'visible');
        })
        .on('mouseout', function (d) {
          $('#tooltipLinkID' + d.target.id).css('visibility', 'hidden');
          $('#tooltipLinkTextID' + d.target.id).css('visibility', 'hidden');
          $('#linkExpandId' + d.target.id).css('visibility', 'hidden');
        })
        .on('contextmenu', function () {
          return false;
        });

      // linkEnterTooltip
      //   .append("rect")
      //   .attr("id", function (d) {
      //     return "tooltipLinkID" + d.target.id;
      //   })
      //   .attr("class", "tooltip-box")
      //   .style("fill-opacity", 0.8)
      //   .attr("x", function (d) {
      //     return (d.target.y + rectNode.width - d.source.y) / 2 + d.source.y;
      //   })
      //   .attr("y", function (d) {
      //     return (d.target.x - d.source.x) / 2 + d.source.x;
      //   })
      //   .attr("width", tooltip.width)
      //   .attr("height", tooltip.height)
      //   .on("mouseover", function (d) {
      //     $("#tooltipLinkID" + d.target.id).css("visibility", "visible");
      //     $("#tooltipLinkTextID" + d.target.id).css("visibility", "visible");

      //     // After selected a link, the cursor can be hover the tooltip, that's why we still need to highlight the link and the arrow
      //     $("#linkID" + d.target.id).attr("class", "linkselected");
      //     $("#linkID" + d.target.id).attr(
      //       "marker-end",
      //       "url(#end-arrow-selected)"
      //     );
      //     $("#linkID" + d.target.id).attr(
      //       "marker-start",
      //       linkMarkerStart(d.target.link.direction, true)
      //     );

      //     removeMouseEvents();
      //   })
      //   .on("mouseout", function (d) {
      //     $("#tooltipLinkID" + d.target.id).css("visibility", "hidden");
      //     $("#tooltipLinkTextID" + d.target.id).css("visibility", "hidden");

      //     $("#linkID" + d.target.id).attr("class", "link");
      //     $("#linkID" + d.target.id).attr("marker-end", "url(#end-arrow)");
      //     $("#linkID" + d.target.id).attr(
      //       "marker-start",
      //       linkMarkerStart(d.target.link.direction, false)
      //     );

      //     reactivateMouseEvents();
      //   });

      // linkEnterTooltip
      //   .append("text")
      //   .attr("id", function (d) {
      //     return "tooltipLinkTextID" + d.target.id;
      //   })
      //   .attr("class", "tooltip-text")
      //   .attr("x", function (d) {
      //     return (
      //       (d.target.y + rectNode.width - d.source.y) / 2 +
      //       d.source.y +
      //       tooltip.textMargin
      //     );
      //   })
      //   .attr("y", function (d) {
      //     return (
      //       (d.target.x - d.source.x) / 2 + d.source.x + tooltip.textMargin * 2
      //     );
      //   })
      //   .attr("width", tooltip.width)
      //   .attr("height", tooltip.height)
      //   .style("fill", "white")
      //   .append("tspan")
      //   .text(function (d) {
      //     return linkType(d.target.link);
      //   })
      //   .append("tspan")
      //   .attr("x", function (d) {
      //     return (
      //       (d.target.y + rectNode.width - d.source.y) / 2 +
      //       d.source.y +
      //       tooltip.textMargin
      //     );
      //   })
      //   .attr("dy", "1.5em")
      //   .text(function (d) {
      //     return d.target.link.name;
      //   });

      // Transition links to their new position.

      var linkUpdate = link
        .transition()
        .duration(duration / 2)
        .attr('d', function (d) {
          if (
            !d.target.hasOwnProperty('addMode') ||
            d.target.addMode !== self.options.nodeAddMode.Manual
          ) {
            return diagonal(d);
          }

          return null;
          // if (d.target === self.options.lastChildAdded[0])
          //   if (updateType === self.options.updateType.DragDrop) {
          //     console.log('Drop Node');
          //     return;
          //   }
        });

      linkTooltip
        .transition()
        .duration(duration / 2)
        .attr('d', function (d) {
          return diagonal(d);
        });

      // Transition exiting nodes to the parent's new position.
      link.exit().transition().remove();

      linkTooltip.exit().transition().remove();

      //#endregion

      // Stash the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    function applyTranslateValues(nodeEnter, nodeEnterTooltip) {
      if (nodeEnter.data()[0].translateValues) {
        nodeEnter
          .transition()
          .duration(0)
          .attr('transform', function (d) {
            return nodeEnter.data()[0].translateValues
              ? 'translate(' +
                  nodeEnter.data()[0].translateValues.left +
                  ',' +
                  nodeEnter.data()[0].translateValues.top +
                  ')'
              : 'translate(' + d.y + ',' + d.x + ')';
          });

        nodeEnterTooltip
          .transition()
          .duration(0)
          .attr('transform', function (d) {
            return nodeEnter.data()[0].translateValues
              ? 'translate(' +
                  nodeEnter.data()[0].translateValues.left +
                  ',' +
                  nodeEnter.data()[0].translateValues.top +
                  ')'
              : 'translate(' + d.y + ',' + d.x + ')';
          });
      }
    }

    function getDrawAreaTranslateAttribute() {
      try {
        var drawAreaTransformAtrribute = d3
          .select('.drawarea')
          .attr('transform');

        if (drawAreaTransformAtrribute) {
          drawAreaTranslation = drawAreaTransformAtrribute
            .substring(
              drawAreaTransformAtrribute.indexOf('(') + 1,
              drawAreaTransformAtrribute.indexOf(')')
            )
            .split(',');
          return [
            parseFloat(drawAreaTranslation[0]),
            parseFloat(drawAreaTranslation[1]),
          ];
        }
        return [0, 0];
      } catch (ex) {
        console.log(ex.message);
        return [0, 0];
      }
    }

    function setDrawAreaTranslateAttribute(transformValue) {
      const { k, x, y } = transformValue;
      self.options.currentDrawAreaTranslation = [x, y];
    }

    function getDrawAreaScaleAttribute() {
      try {
        var drawAreaTransformAtrribute = d3
          .select('.drawarea')
          .attr('transform');

        if (drawAreaTransformAtrribute) {
          var scaleAttribute = drawAreaTransformAtrribute.substring(
            drawAreaTransformAtrribute.lastIndexOf('(') + 1,
            drawAreaTransformAtrribute.lastIndexOf(')')
          );
          return [parseFloat(scaleAttribute)];
        }
        return 1; //no scaling
      } catch (ex) {
        console.log(ex.message);
        return 1;
      }
    }

    function dragStart() {}

    function drag() {
      // console.log('drag function called');
      // d3.event.sourceEvent.stopPropagation();
      // d3.select('.drawarea').attr('transform', function (d) {
      //   return 'translate(' + drawAreaTranslation + ')';
      // });
    }

    function dragEnd() {
      drawAreaTranslation = getDrawAreaTranslateAttribute();
      $('div.d3-container').css('cursor', 'default');
    }

    function onMouseDown() {
      if (d3.event.button === 0) {
        $('div.d3-container').css('cursor', 'grab');
      }
    }

    // Zoom functionality is activated

    function zoomAndScale() {
      var x = (y = 0);
      var k = 1;
      if (d3.event && typeof d3.event.transform !== 'undefined') {
        //get drawArea global transform attributes (relative to initial rendered value)
        //drawAreaTranslation = getDrawAreaTranslateAttribute();
        //get current scaling and translation values (relative to previous position/scale)
        //current translation and scale are considered between two drag/zoom consecutive events

        var { x, y, k } = d3.event.transform;
      } else {
        // first zoom and scale values applied (no explicit event fired)
        self.options.isInteractedWith = true;
      }

      self.options.currentScale = k;
      self.options.currentDrawAreaTranslation = [x, y];

      // limit translation to thresholds

      var tbound =
          (-height / 2 + tooltip.height + 10) * self.options.currentScale,
        bbound =
          self.options.currentScale >= 1
            ? (height / 2 - (rectNode.height + tooltip.height / 2)) /
              self.options.currentScale
            : (height / 2 - (rectNode.height + 10)) /
              Math.sqrt(self.options.currentScale);
      (lbound = leftBound),
        (rbound = width - tooltip.width * self.options.currentScale);

      drawAreaTranslation = [
        Math.max(
          Math.min(self.options.currentDrawAreaTranslation[0], rbound),
          lbound
        ),
        Math.max(
          Math.min(self.options.currentDrawAreaTranslation[1], bbound),
          tbound
        ),
      ];
      // if (self.options.recentered == false) {
      d3.select('.drawarea').attr('transform', function (d) {
        return (
          'translate(' +
          drawAreaTranslation +
          ')' +
          ' scale(' +
          self.options.currentScale +
          ')'
        );
      });
      setDrawAreaTranslateAttribute(d3.event.transform);

      drawAreaTranslation = getDrawAreaTranslateAttribute();
      drawAreaScale = getDrawAreaScaleAttribute();
    }

    function zoomEnd() {
      drawAreaTranslation = getDrawAreaTranslateAttribute();
      drawAreaScale = getDrawAreaScaleAttribute();
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d, self.options.DefaultLayout);
    }

    // Breadth-first traversal of the tree
    // func function is processed on every node of a same level
    // return the max level
    function breadthFirstTraversal(tree, func) {
      var max = 0;
      if (tree && tree.length > 0) {
        var currentDepth = tree[0].depth;
        var fifo = [];
        var currentLevel = [];

        fifo.push(tree[0]);
        while (fifo.length > 0) {
          var node = fifo.shift();
          if (node.depth > currentDepth) {
            func(currentLevel);
            currentDepth++;
            max = Math.max(max, currentLevel.length);
            currentLevel = [];
          }
          currentLevel.push(node);
          if (node.children) {
            for (var j = 0; j < node.children.length; j++) {
              fifo.push(node.children[j]);
            }
          }
        }
        func(currentLevel);
        return Math.max(max, currentLevel.length);
      }
      return 0;
    }

    // x = ordoninates and y = abscissas
    function collision(siblings) {
      var minPadding = 5;
      if (siblings) {
        for (var i = 0; i < siblings.length - 1; i++) {
          if (
            siblings[i + 1].x - (siblings[i].x + rectNode.height) <
            minPadding
          )
            siblings[i + 1].x = siblings[i].x + rectNode.height + minPadding;
        }
      }
    }

    function removeMouseEvents() {
      // Drag and zoom behaviors are temporarily disabled, so tooltip text can be selected
      mousedown = d3
        .select('#tree-container')
        .select('svg')
        .on('mousedown.zoom');
      d3.select('#tree-container').select('svg').on('mousedown.zoom', null);
    }

    function reactivateMouseEvents() {
      // Reactivate the drag and zoom behaviors
      d3.select('#tree-container')
        .select('svg')
        .on('mousedown.zoom', mousedown);
    }

    // Name of the event depends of the browser
    function getMouseWheelEvent() {
      if (d3.select('#tree-container').select('svg').on('wheel.zoom')) {
        mouseWheelName = 'wheel.zoom';
        return d3.select('#tree-container').select('svg').on('wheel.zoom');
      }
      if (
        d3.select('#tree-container').select('svg').on('mousewheel.zoom') != null
      ) {
        mouseWheelName = 'mousewheel.zoom';
        return d3.select('#tree-container').select('svg').on('mousewheel.zoom');
      }
      if (
        d3.select('#tree-container').select('svg').on('DOMMouseScroll.zoom')
      ) {
        mouseWheelName = 'DOMMouseScroll.zoom';
        return d3
          .select('#tree-container')
          .select('svg')
          .on('DOMMouseScroll.zoom');
      }
    }

    function diagonal(d) {
      var p0 = {
          x: d.source.x + rectNode.height / 2,
          y: d.source.y + rectNode.width,
        },
        p3 = {
          x: d.target.x + rectNode.height / 2,
          y: d.target.y - 12, // -12, so the end arrows are just before the rect node
        },
        m = (p0.y + p3.y) / 2,
        p = [
          p0,
          {
            x: p0.x,
            y: m,
          },
          {
            x: p3.x,
            y: m,
          },
          p3,
        ];
      p = p.map(function (d) {
        return [d.y, d.x];
      });
      return 'M' + p[0] + 'C' + p[1] + ' ' + p[2] + ' ' + p[3]; // cubic curve (p[1] && p[2] are control points
      //which define de slope of the line starting at each point)
    }

    function initDropShadow() {
      var filter = defs
        .append('filter')
        .attr('id', 'drop-shadow')
        .attr('color-interpolation-filters', 'sRGB');

      filter
        .append('feOffset')
        .attr('result', 'offOut')
        .attr('in', 'SourceGraphic')
        .attr('dx', 0)
        .attr('dy', 0);

      filter.append('feGaussianBlur').attr('stdDeviation', 2);

      filter
        .append('feOffset')
        .attr('dx', 2)
        .attr('dy', 2)
        .attr('result', 'shadow');

      filter
        .append('feComposite')
        .attr('in', 'offOut')
        .attr('in2', 'shadow')
        .attr('operator', 'over');
    }

    function initArrowDef() {
      // Build the arrows definitions
      // End arrow
      defs
        .append('marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .attr('class', 'arrow')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5');

      // End arrow selected
      defs
        .append('marker')
        .attr('id', 'end-arrow-selected')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .attr('class', 'arrowselected')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5');

      // Start arrow
      defs
        .append('marker')
        .attr('id', 'start-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .attr('class', 'arrow')
        .append('path')
        .attr('d', 'M10,-5L0,0L10,5');

      // Start arrow selected
      defs
        .append('marker')
        .attr('id', 'start-arrow-selected')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .attr('class', 'arrowselected')
        .append('path')
        .attr('d', 'M10,-5L0,0L10,5');
    }

    function updateSourceDataTest() {
      self.graph_data.tree.children.push({
        nodeName: 'NODE NAME 0',
        name: 'NODE NAME 0',
        type: 'type3',
        code: 'N1',
        label: 'Node name 1',
        version: 'v1.0',
        link: {
          name: 'Link NODE NAME 1',
          nodeName: 'NODE NAME 1',
          direction: 'ASYN',
        },
        children: [],
      });

      drawTree(self.graph_data.tree);
    }

    function addNewChildNode(d, item) {
      self.options.lastChildAdded = item;
      if (d != null) {
        item.forEach(function (i) {
          if (d._children) d._children.push(i);
          else if (d.children) d.children.push(i);
          else {
            d.children = [];
            d.children.push(i);
          }
        });
      }
    }

    function addNewInBetweenNode(dSource, dTarget, item) {
      //addNewChildNode(dSource, item);
      var dTargetChildindex;
      item.forEach(function (i) {
        if (dSource._children) {
          dTargetChildindex = dSource._children.indexOf(dTarget);

          if (dTargetChildindex > -1) {
            dSource._children.splice(dTargetChildindex, 1);
          }
          dSource._children.push(i);
        } else if (dSource.children) {
          dTargetChildindex = dSource.children.indexOf(dTarget);

          if (dTargetChildindex > -1) {
            dSource.children.splice(dTargetChildindex, 1);
          }

          dSource.children.push(i);
        } else {
          dSource.children = [];
          dSource.children.push(i);
        }

        if (i._children) i._children.push(dTarget);
        else if (i.children) i.children.push(dTarget);
        else {
          i.children = [];
          i.children.push(dTarget);
        }
      });
    }

    function addNewSpareNode(name, translateValues) {
      // node added from drag&drop / dblClick dialog
      var items = [
        {
          nodeName: name,
          name: 'NODE NAME 0',
          type: 'type3',
          code: 'N1',
          label: name,
          version: 'v1.0',
          link: {
            name: 'Link NODE NAME 1',
            nodeName: 'NODE NAME 1',
            direction: 'ASYN',
          },
          description: 'New ' + name + ' node',
          children: [],
          color: darkGreen,
          translateValues: translateValues,
          addMode: self.options.nodeAddMode.Manual,
        },
      ];

      addNewChildNode(root, items);
      update(root, self.options.updateType.DragDrop);
    }

    function removeNode(nodeData) {
      var target = nodeData; //nodeData.target;

      var children = [];

      if (typeof target.parent !== 'undefined') {
        //consider root node => to be deletable or not

        if (typeof target.children !== 'undefined')
          target.children.forEach(function (targetChild) {
            if (targetChild.id != target.id) {
              //add to the child list if target id is not same
              //so that the node target is removed.
              children.push(targetChild);
            }
          });

        if (typeof target.parent.children !== 'undefined')
          target.parent.children.forEach(function (parentChild) {
            if (parentChild.id != target.id) {
              //add to the child list if target id is not same
              //so that the node target is removed.
              children.push(parentChild);
            }
          });

        //set the target parent with new set of children
        target.parent.children = children;
        //redraw the parent since one of its children is removed
        update(target.parent, self.options.updateType.DefaultLayout);
      } else {
        throw 'Root removal not implemented yet';
      }
    }

    function removeNodeWithSubtree(nodeData) {
      var target = nodeData; //nodeData.target;

      var children = [];

      //iterate through the children

      if (typeof target.parent !== 'undefined') {
        //consider root node => to be deletable or not

        if (typeof target.parent.children !== 'undefined')
          target.parent.children.forEach(function (child) {
            if (child.id != target.id) {
              //add to the child list if target id is not same
              //so that the node target is removed.
              children.push(child);
            }
          });
        //set the target parent with new set of children
        target.parent.children = children;
        //redraw the parent since one of its children is removed
        update(target.parent, self.options.updateType.DefaultLayout);
      } else {
        throw 'Root removal not implemented yet';
      }
    }

    // #region DIALOG BUTTONS INIT

    function _dialogAddNodeButtonsSet() {
      var addNodeButtons = {
        'Add node': function () {
          var newItem = [
            {
              nodeName: 'Test',
              name: 'Test',
              type: 'type1',
              code: 'N4.3',
              label: 'Test Node',
              version: 'v1.0',
              description: 'New Node',
              link: {
                name: 'Link node 3.4 to 4.2',
                nodeName: 'NODE NAME 4.1',
                direction: 'ASYN',
              },
              children: [],
            },
          ];
          newItem[0].color = currentParrentNode.color;

          addNewInBetweenNode(currentParrentNode, currentChildNode, newItem);

          $(this).dialog('close');
          update(root, self.options.updateType.DefaultLayout);
        },
        Cancel: function () {
          $(this).dialog('close');
        },
      };

      return addNodeButtons;
    }

    function _dialogRemoveNodeButtonsSet(currentNode, isLeafNode) {
      var buttons = {
        'Delete node': function () {
          try {
            removeNode(currentNode);
          } catch (e) {
            console.error(e);
          }

          $(this).dialog('close');
        },
        'Delete node and subtree': function () {
          try {
            removeNodeWithSubtree(currentNode);
          } catch (e) {
            console.error(e);
          }
          $(this).dialog('close');
          //update(root);
        },
        Cancel: function () {
          $(this).dialog('close');
        },
      };

      if (isLeafNode) {
        delete buttons['Delete node and subtree'];
      }

      return buttons;
    }
    // #endregion

    // #region COMPONENTS INIT

    function initModal() {
      $('.btn-create').on('click', function (event) {
        var newItem = [
          {
            nodeName: 'NODE NAME Test',
            name: 'NODE NAME Test',
            type: 'type1',
            code: 'N4.3',
            label: 'Node name 4.3',
            version: 'v1.0',
            link: {
              name: 'Link node 3.4 to 4.2',
              nodeName: 'NODE NAME 4.1',
              direction: 'ASYN',
            },
            children: [],
          },
        ];
        newItem[0].color = currentParrentNode.color;

        if (clickTarget.indexOf('node') != -1) {
          addNewChildNode(currentParrentNode, newItem);
        } else if (clickTarget.indexOf('edge') != '-1') {
          addNewInBetweenNode(currentParrentNode, currentChildNode, newItem);
        }

        $('.newNodeModalContainer').modal('hide');
        update(root, self.options.updateType.DefaultLayout);
      });
    }

    function initSelect2() {
      $('.node-type-select').select2({
        theme: 'classic',
        dropdownParent: '.newNodeModalContainer',
      });
    }

    //  #endregion
  },

  // #endregion

  // #region CTX-MENU

  initContextMenuEvents: function () {
    var self = this;
    const exportXML = document
      .querySelector('.d3-ctx-menu-option.ctx-menu-exportXML')
      .addEventListener('click', function () {
        structuredData = self.graph_data.tree;
        if (self.isJSON(structuredData)) self.exportAsXML(structuredData);
        else {
          throw new Error('Invalid format');
        }
      });

    const recenterGraph = document
      .querySelector('.d3-ctx-menu-option.ctx-menu-recenterGraph')
      .addEventListener('click', function () {
        self.options.baseSvg.call(
          self.options.d3Zoom.transform,
          d3.zoomIdentity
        );
      });
  },

  displayClassicContextMenu: function (e) {
    e.preventDefault();
    document.querySelector('.d3-ctx-menu').style.display = 'block';

    const origin = {
      left: e.offsetX,
      top: e.offsetY,
    };

    var menu = $('.d3-ctx-menu')[0];

    if (typeof menu !== 'undefined') this.setPosition(menu, origin);

    return false;
  },

  toggleMenu: function (menuType, command) {
    if (menuType.style !== undefined)
      menuType.style.display = command === 'show' ? 'inline-block' : 'none';
  },

  setPosition: function (menuType, { top, left }) {
    menuType.style.left = `${left + 5}px`;
    menuType.style.top = `${top}px`;
    this.toggleMenu(menuType, 'show');
  },

  // #endregion

  // #region DOM-EVENT-HANDLING

  initDOMEventListeners: function () {
    var self = this;
    document.addEventListener('keypress', function (e) {
      if (e.key && e.key == 'Enter') {
      }
    });

    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();

      //prevent right-clicking on bootstrap icons
      if (Array.from(e.target.classList).indexOf('bi') == -1)
        self.displayClassicContextMenu(e);
    });

    document.addEventListener('click', function (e) {
      var menu = $('.d3-ctx-menu')[0];
      if (typeof menu !== 'undefined') self.toggleMenu(menu, 'hide');
    });

    $(document).on(
      'click',
      'div.workflow-engine-designer-nodetypes.svg-wrapper',
      function () {
        if (
          self.options.newNodeDialog &&
          typeof self.options.newNodeDialog !== 'undefined'
        ) {
          self.displayNewNodeDialog();
        }
      }
    );
  },

  //#endregion

  // #region XML-EXPORT

  exportAsXML: function (JSONData) {
    // const svg = document.querySelector("svg").cloneNode(true); // clone your original svg
    // document.body.appendChild(svg); // append element to document
    // const g = svg.querySelector("g"); // select the parent g
    // g.setAttribute("transform", ""); // clean transform
    // svg.setAttribute("width", g.getBBox().width); // set svg to be the g dimensions
    // svg.setAttribute("height", g.getBBox().height);
    // var svgAsXML = new XMLSerializer().serializeToString(svg);
    // console.log(svgAsXML);

    var x2js = new X2JS();
    try {
      var JSONDataNonCircullar = JSON.stringify(
        JSONData,
        function (key, value) {
          if (key == 'parent') {
            return { id: value['id'], name: value['name'] };
          } else {
            return value;
          }
        }
      );
      var xml = x2js.json2xml_str(JSON.parse(JSONDataNonCircullar));
      var pretty_xml = vkbeautify.xml(xml, 6);

      var string_data =
        'data:text/xml; charset=utf-8,' + encodeURIComponent(pretty_xml);

      var anchor = document.createElement('a');
      anchor.setAttribute('href', string_data);
      anchor.setAttribute(
        'download',
        `designTree-${new Date().toLocaleString()}.xml`
      );

      //console.log(pretty_xml);
      anchor.click();
      anchor.remove();
    } catch (ex) {
      mdtLogger.error('_exportxml', ex.message);
    }
  },

  // #endregion

  //#region UTILS

  isJSON: function (obj) {
    return obj !== undefined && obj !== null && obj.constructor == Object;
  },

  OBJtoXML: function (obj) {
    var xml = '';
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? '' : '<' + prop + '>';
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += '<' + prop + '>';
          xml += OBJtoXML(new Object(obj[prop][array]));
          xml += '</' + prop + '>';
        }
      } else if (typeof obj[prop] == 'object') {
        xml += OBJtoXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : '</' + prop + '>';
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml;
  },

  // #endregion
});

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(2);
	var odata_1 = __webpack_require__(3);
	var grid_1 = __webpack_require__(6);
	var adapter = new odata_1.ODataAdapter();
	ReactDOM.render(React.createElement(grid_1.Grid, {adapter: adapter}), document.getElementById("example"));


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var adapter_1 = __webpack_require__(4);
	var Renderers = __webpack_require__(5);
	var ODataAdapter = (function (_super) {
	    __extends(ODataAdapter, _super);
	    function ODataAdapter() {
	        _super.apply(this, arguments);
	    }
	    ODataAdapter.prototype.getColumns = function () {
	        return new Promise(function (resolve, reject) {
	            resolve(ODataAdapter.COLUMNS);
	        });
	    };
	    ODataAdapter.prototype.handleResponse = function (response) {
	        return response.value.map(function (i) {
	            i["id"] = i[ODataAdapter.IDENTIFIER];
	            return i;
	        });
	    };
	    ODataAdapter.prototype.buildUri = function (uri, query) {
	        if (!!query) {
	            var buffer = [];
	            if (!!query.sorting) {
	                buffer.push("$orderby=" + query.sorting.key + (query.sorting.asc === false ? " desc" : " asc"));
	            }
	            if (!!query.select) {
	                buffer.push("$select=" + query.select.join(", "));
	            }
	            if (!!query.top) {
	                buffer.push("$top=" + query.top);
	            }
	            if (!!query.skip) {
	                buffer.push("$skip=" + query.skip);
	            }
	            if (buffer.length > 0) {
	                uri = uri + "?" + buffer.join("&");
	            }
	        }
	        return uri;
	    };
	    ODataAdapter.prototype.find = function (query) {
	        var _this = this;
	        var uri = this.buildUri(ODataAdapter.URI, query);
	        return new Promise(function (resolve, reject) {
	            var request = new XMLHttpRequest();
	            request.open("GET", uri, true);
	            request.onload = function () {
	                if (request.status >= 200 && request.status < 400) {
	                    var response = JSON.parse(request.responseText);
	                    var entities = _this.handleResponse(response);
	                    resolve(entities);
	                }
	                else {
	                    reject();
	                }
	            };
	            request.onerror = function () {
	                reject();
	            };
	            request.send();
	        });
	    };
	    ODataAdapter.URI = "http://services.odata.org/V4/OData/OData.svc/Products";
	    ODataAdapter.IDENTIFIER = "ID";
	    ODataAdapter.COLUMNS = [
	        { key: "ID", width: 70 },
	        { key: "Name", width: 140, sortable: true, render: Renderers.Strong },
	        { key: "Description", width: 250, sortable: true },
	        { key: "Rating", width: 70, textAlign: "right" }
	    ];
	    return ODataAdapter;
	}(adapter_1.Adapter));
	exports.ODataAdapter = ODataAdapter;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	var Adapter = (function () {
	    function Adapter() {
	    }
	    return Adapter;
	}());
	exports.Adapter = Adapter;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var React = __webpack_require__(1);
	exports.Strong = function (value) {
	    return React.createElement("strong", null, value);
	};
	exports.Em = function (value) {
	    return React.createElement("em", null, value);
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var header_1 = __webpack_require__(7);
	var body_1 = __webpack_require__(8);
	var Grid = (function (_super) {
	    __extends(Grid, _super);
	    function Grid(props) {
	        _super.call(this, props);
	        this.state = {
	            entities: [],
	            selection: [],
	            columns: []
	        };
	        this.loadColumns();
	    }
	    Grid.prototype.buildQuery = function () {
	        return {
	            skip: this.state.entities.length,
	            sorting: this.state.sorting,
	            filter: this.state.filter,
	            select: this.state.select
	        };
	    };
	    Grid.prototype.loadColumns = function () {
	        var _this = this;
	        this.props.adapter.getColumns().then(function (columns) {
	            _this.setState(function (prevState, props) {
	                prevState.columns = columns;
	                return prevState;
	            }, function () { _this.load(); });
	        });
	    };
	    Grid.prototype.load = function () {
	        var _this = this;
	        var query = this.buildQuery();
	        this.props.adapter.find(query).then(function (entities) {
	            _this.setState(function (prevState, props) {
	                prevState.entities = entities;
	                prevState.selection = [];
	                return prevState;
	            });
	        });
	    };
	    Grid.prototype.handleSelect = function (index) {
	        var entity = this.state.entities[index];
	        this.setState(function (prevState, props) {
	            var selectionIndex = prevState.selection.indexOf(entity.id);
	            if (selectionIndex != -1) {
	                prevState.selection.splice(selectionIndex, 1);
	            }
	            else {
	                prevState.selection.push(entity.id);
	            }
	            return prevState;
	        });
	    };
	    Grid.prototype.handleSelectAll = function () {
	        var _this = this;
	        this.setState(function (prevState, props) {
	            if (prevState.selection.length > 0) {
	                prevState.selection = [];
	            }
	            else {
	                prevState.selection = _this.state.entities.map(function (e) { return e.id; });
	            }
	            return prevState;
	        });
	    };
	    Grid.prototype.handleSort = function (key) {
	        var _this = this;
	        this.setState(function (prevState, props) {
	            if (!prevState.sorting || prevState.sorting.key != key) {
	                prevState.sorting = {
	                    key: key,
	                    asc: true
	                };
	            }
	            else {
	                if (prevState.sorting.asc == true) {
	                    prevState.sorting.asc = false;
	                }
	                else {
	                    prevState.sorting = undefined;
	                }
	            }
	            prevState.entities = [];
	            return prevState;
	        }, function () { _this.load(); });
	    };
	    Grid.prototype.handleScroll = function (e) {
	        var scrollable = e.target;
	        var scrollTop = scrollable.scrollTop;
	        var scrollLeft = scrollable.scrollLeft;
	        var header = scrollable.getElementsByClassName('react-grid-header')[0];
	        var body = scrollable.getElementsByClassName('react-grid-body')[0];
	        if (scrollTop != 0 || scrollLeft != 0) {
	            body.style.marginTop = header.offsetHeight + "px";
	            header.style.position = "absolute";
	            header.style.top = scrollTop + "px";
	            header.style.left = "0";
	            header.style.width = header.parentElement.clientWidth + "px";
	        }
	        else {
	            body.style.marginTop = "0";
	            header.style.position = "static";
	            header.style.top = "auto";
	            header.style.left = "auto";
	            header.style.width = "auto";
	        }
	    };
	    Grid.prototype.render = function () {
	        var _this = this;
	        var allSelected = this.state.selection.length > 0;
	        return (React.createElement("div", {className: "react-grid"}, React.createElement("div", {className: "react-grid-scrollable", onScroll: function (e) { return _this.handleScroll(e); }}, React.createElement("div", {className: "react-grid-inner"}, React.createElement(header_1.Header, {columns: this.state.columns, selected: allSelected, onSelectAll: function () { return _this.handleSelectAll(); }, sorting: this.state.sorting, onSort: function (key) { return _this.handleSort(key); }}), React.createElement(body_1.Body, {columns: this.state.columns, entities: this.state.entities, selection: this.state.selection, onSelect: function (index) { return _this.handleSelect(index); }})))));
	    };
	    return Grid;
	}(React.Component));
	exports.Grid = Grid;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	(function (SortState) {
	    SortState[SortState["Disabled"] = 0] = "Disabled";
	    SortState[SortState["Enabled"] = 1] = "Enabled";
	    SortState[SortState["Ascending"] = 2] = "Ascending";
	    SortState[SortState["Descending"] = 3] = "Descending";
	})(exports.SortState || (exports.SortState = {}));
	var SortState = exports.SortState;
	var Header = (function (_super) {
	    __extends(Header, _super);
	    function Header() {
	        _super.apply(this, arguments);
	    }
	    Header.prototype.getSortState = function (column) {
	        if (column.sortable) {
	            if (this.props.sorting && this.props.sorting.key == column.key) {
	                return this.props.sorting.asc ? SortState.Ascending : SortState.Descending;
	            }
	            else {
	                return SortState.Enabled;
	            }
	        }
	        else {
	            return SortState.Disabled;
	        }
	    };
	    Header.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", {className: "react-grid-header"}, React.createElement(CheckboxHeaderCell, {checked: this.props.selected, onCheck: this.props.onSelectAll}), this.props.columns.map(function (column) {
	            var title = column.title || column.key;
	            return (React.createElement(HeaderCell, {key: column.key, title: title, width: column.width, onSort: function () { return _this.props.onSort(column.key); }, sortState: _this.getSortState(column)}));
	        })));
	    };
	    Header.defaultProps = {
	        sorting: {}
	    };
	    return Header;
	}(React.Component));
	exports.Header = Header;
	var HeaderCell = (function (_super) {
	    __extends(HeaderCell, _super);
	    function HeaderCell() {
	        _super.apply(this, arguments);
	    }
	    Object.defineProperty(HeaderCell.prototype, "sortEnabled", {
	        get: function () {
	            return this.props.sortState != SortState.Disabled;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    HeaderCell.prototype.handleSort = function () {
	        if (this.sortEnabled) {
	            this.props.onSort();
	        }
	    };
	    HeaderCell.prototype.render = function () {
	        var _this = this;
	        var width = { width: this.props.width + 'px' };
	        var maxWidth = { maxWidth: this.props.width - 10 - (this.sortEnabled ? 17 : 0) + 'px' };
	        var sortable;
	        switch (this.props.sortState) {
	            case SortState.Ascending:
	                sortable = React.createElement("span", {className: "icon-sort-up"});
	                break;
	            case SortState.Descending:
	                sortable = React.createElement("span", {className: "icon-sort-down"});
	                break;
	            case SortState.Enabled:
	                sortable = React.createElement("span", {className: "icon-sort"});
	                break;
	        }
	        var sortableClass = (this.sortEnabled ? "react-grid-header-cell sortable" : "react-grid-header-cell");
	        return (React.createElement("div", {style: width, className: sortableClass, onClick: function () { return _this.handleSort(); }}, React.createElement("span", {style: maxWidth, className: "title", title: this.props.title}, this.props.title), sortable));
	    };
	    HeaderCell.defaultProps = {
	        width: 100,
	        sortState: SortState.Disabled
	    };
	    return HeaderCell;
	}(React.Component));
	exports.HeaderCell = HeaderCell;
	var CheckboxHeaderCell = (function (_super) {
	    __extends(CheckboxHeaderCell, _super);
	    function CheckboxHeaderCell(props) {
	        _super.call(this, props);
	    }
	    CheckboxHeaderCell.prototype.style = function () {
	        return {
	            padding: '1px',
	            width: '24px'
	        };
	    };
	    CheckboxHeaderCell.prototype.render = function () {
	        return (React.createElement("div", {onClick: this.props.onCheck, style: this.style(), className: "react-grid-header-cell"}, React.createElement("input", {type: "checkbox", checked: this.props.checked, readOnly: true})));
	    };
	    CheckboxHeaderCell.defaultProps = {
	        checked: false
	    };
	    return CheckboxHeaderCell;
	}(React.Component));
	exports.CheckboxHeaderCell = CheckboxHeaderCell;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var row_1 = __webpack_require__(9);
	var Body = (function (_super) {
	    __extends(Body, _super);
	    function Body() {
	        _super.apply(this, arguments);
	    }
	    Body.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", {className: "react-grid-body"}, this.props.entities.map(function (entity, index) {
	            var selected = _this.props.selection.indexOf(entity.id) != -1;
	            return (React.createElement(row_1.Row, {key: entity.id, entity: entity, columns: _this.props.columns, selected: selected, onSelect: function () { return _this.props.onSelect(index); }}));
	        })));
	    };
	    return Body;
	}(React.Component));
	exports.Body = Body;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var cell_1 = __webpack_require__(10);
	var Row = (function (_super) {
	    __extends(Row, _super);
	    function Row() {
	        _super.apply(this, arguments);
	    }
	    Row.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", {className: "react-grid-row"}, React.createElement(cell_1.CheckboxCell, {checked: this.props.selected, onCheck: this.props.onSelect}), this.props.columns.map(function (column) {
	            var value = _this.props.entity[column.key];
	            return (React.createElement(cell_1.Cell, {key: column.key, value: value, width: column.width, textAlign: column.textAlign, render: column.render}));
	        })));
	    };
	    return Row;
	}(React.Component));
	exports.Row = Row;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var Cell = (function (_super) {
	    __extends(Cell, _super);
	    function Cell() {
	        _super.apply(this, arguments);
	    }
	    Cell.prototype.style = function () {
	        return {
	            width: this.props.width + 'px',
	            textAlign: this.props.textAlign
	        };
	    };
	    Cell.prototype.value = function () {
	        if (!!this.props.render) {
	            return this.props.render(this.props.value);
	        }
	        else {
	            return this.props.value;
	        }
	    };
	    Cell.prototype.render = function () {
	        var value = this.props.value;
	        return (React.createElement("div", {style: this.style(), className: "react-grid-row-cell"}, this.value()));
	    };
	    Cell.defaultProps = {
	        width: 100,
	        textAlign: "left"
	    };
	    return Cell;
	}(React.Component));
	exports.Cell = Cell;
	var CheckboxCell = (function (_super) {
	    __extends(CheckboxCell, _super);
	    function CheckboxCell(props) {
	        _super.call(this, props);
	    }
	    CheckboxCell.prototype.style = function () {
	        return {
	            padding: '1px',
	            width: '24px'
	        };
	    };
	    CheckboxCell.prototype.render = function () {
	        return (React.createElement("div", {onClick: this.props.onCheck, style: this.style(), className: "react-grid-row-cell"}, React.createElement("input", {type: "checkbox", checked: this.props.checked, readOnly: true})));
	    };
	    CheckboxCell.defaultProps = {
	        checked: false
	    };
	    return CheckboxCell;
	}(React.Component));
	exports.CheckboxCell = CheckboxCell;


/***/ }
/******/ ]);
//# sourceMappingURL=react-grid.js.map
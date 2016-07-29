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
	var adapter_1 = __webpack_require__(3);
	var grid_1 = __webpack_require__(4);
	var adapter = new adapter_1.Adapter();
	var columns = [
	    { key: "id", width: 70 },
	    { key: "firstName", width: 120, sortable: true },
	    { key: "lastName", width: 120, sortable: true },
	    { key: "age", width: 70 },
	    { key: "address", width: 200 }
	];
	ReactDOM.render(React.createElement(grid_1.Grid, {adapter: adapter, columns: columns}), document.getElementById("example"));


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
/***/ function(module, exports) {

	"use strict";
	var Adapter = (function () {
	    function Adapter() {
	    }
	    Adapter.prototype.defaultQuery = function (query) {
	        if (!!query) {
	            return {
	                top: query.top || Adapter.DEFAULT_TOP,
	                skip: query.skip || 0,
	                orderby: query.orderby,
	                filter: query.filter,
	                select: query.select
	            };
	        }
	        else {
	            return { top: Adapter.DEFAULT_TOP, skip: 0 };
	        }
	    };
	    Adapter.prototype.find = function (query) {
	        query = this.defaultQuery(query);
	        return new Promise(function (resolve, reject) {
	            var chance = new Chance(Adapter.CHANCE_SEED);
	            var rows = [];
	            for (var i = 1; i <= query.top; i++) {
	                rows.push({
	                    id: i,
	                    firstName: chance.first(),
	                    lastName: chance.last(),
	                    age: chance.age(),
	                    address: chance.address()
	                });
	            }
	            query.skip += query.top;
	            resolve({ rows: rows, next: query });
	        });
	    };
	    Adapter.DEFAULT_TOP = 25;
	    Adapter.CHANCE_SEED = 1337;
	    return Adapter;
	}());
	exports.Adapter = Adapter;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var header_1 = __webpack_require__(5);
	var row_1 = __webpack_require__(7);
	var Grid = (function (_super) {
	    __extends(Grid, _super);
	    function Grid(props) {
	        _super.call(this, props);
	        this.state = {
	            entities: [],
	            selection: [],
	            query: {}
	        };
	    }
	    Grid.prototype.componentDidMount = function () {
	        this.load();
	    };
	    Grid.prototype.load = function () {
	        var _this = this;
	        this.props.adapter.find(this.state.query).then(function (data) {
	            _this.setState(function (prevState, props) {
	                prevState.entities = data.rows;
	                prevState.query = data.next;
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
	            delete prevState.query.skip;
	            delete prevState.query.top;
	            var query = prevState.query;
	            if (!query.orderby || query.orderby.key != key) {
	                query.orderby = {
	                    key: key,
	                    asc: true
	                };
	            }
	            else {
	                if (query.orderby.asc == true) {
	                    query.orderby.asc = false;
	                }
	                else {
	                    query.orderby = undefined;
	                }
	            }
	            prevState.query = query;
	            return prevState;
	        }, function () { _this.load(); });
	    };
	    Grid.prototype.handleScroll = function (e) {
	        var scrollable = e.target;
	        var scrollTop = scrollable.scrollTop;
	        var scrollLeft = scrollable.scrollLeft;
	        var header = scrollable.getElementsByClassName('moravia-grid-header')[0];
	        var body = scrollable.getElementsByClassName('moravia-grid-body')[0];
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
	        return (React.createElement("div", {className: "moravia-grid"}, React.createElement("div", {className: "moravia-grid-scrollable", onScroll: this.handleScroll.bind(this)}, React.createElement("div", {className: "moravia-grid-inner"}, React.createElement(header_1.Header, {columns: this.props.columns, selected: allSelected, onSelectAll: function () { return _this.handleSelectAll(); }, sorting: this.state.query.orderby, onSort: function (key) { return _this.handleSort(key); }}), React.createElement("div", {className: "moravia-grid-body"}, this.state.entities.map(function (entity, index) {
	            var selected = _this.state.selection.indexOf(entity.id) != -1;
	            return (React.createElement(row_1.Row, {key: entity.id, entity: entity, columns: _this.props.columns, selected: selected, onSelect: function () { return _this.handleSelect(index); }}));
	        }))))));
	    };
	    return Grid;
	}(React.Component));
	exports.Grid = Grid;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var cell_1 = __webpack_require__(6);
	var Header = (function (_super) {
	    __extends(Header, _super);
	    function Header() {
	        _super.apply(this, arguments);
	    }
	    Header.prototype.getSortState = function (column) {
	        if (column.sortable) {
	            if (this.props.sorting && this.props.sorting.key == column.key) {
	                return this.props.sorting.asc ? cell_1.SortState.Ascending : cell_1.SortState.Descending;
	            }
	            else {
	                return cell_1.SortState.Enabled;
	            }
	        }
	        else {
	            return cell_1.SortState.Disabled;
	        }
	    };
	    Header.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", {className: "moravia-grid-header"}, React.createElement(cell_1.CheckboxHeaderCell, {checked: this.props.selected, onCheck: this.props.onSelectAll}), this.props.columns.map(function (column) {
	            var title = column.title || column.key;
	            return (React.createElement(cell_1.HeaderCell, {key: column.key, title: title, width: column.width, onSort: function () { return _this.props.onSort(column.key); }, sortState: _this.getSortState(column)}));
	        })));
	    };
	    Header.defaultProps = {
	        sorting: {}
	    };
	    return Header;
	}(React.Component));
	exports.Header = Header;


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
	var Cell = (function (_super) {
	    __extends(Cell, _super);
	    function Cell() {
	        _super.apply(this, arguments);
	    }
	    Cell.prototype.render = function () {
	        var style = {
	            width: this.props.width + 'px'
	        };
	        return (React.createElement("div", {style: style, className: "moravia-grid-row-cell"}, this.props.value));
	    };
	    Cell.defaultProps = {
	        width: 100
	    };
	    return Cell;
	}(React.Component));
	exports.Cell = Cell;
	(function (SortState) {
	    SortState[SortState["Disabled"] = 0] = "Disabled";
	    SortState[SortState["Enabled"] = 1] = "Enabled";
	    SortState[SortState["Ascending"] = 2] = "Ascending";
	    SortState[SortState["Descending"] = 3] = "Descending";
	})(exports.SortState || (exports.SortState = {}));
	var SortState = exports.SortState;
	var HeaderCell = (function (_super) {
	    __extends(HeaderCell, _super);
	    function HeaderCell() {
	        _super.apply(this, arguments);
	    }
	    HeaderCell.prototype.render = function () {
	        var _this = this;
	        var sortEnabled = this.props.sortState != SortState.Disabled;
	        var width = { width: this.props.width + 'px' };
	        var maxWidth = { maxWidth: this.props.width - 10 - (sortEnabled ? 17 : 0) + 'px' };
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
	        var sortableClass = (sortEnabled ? "moravia-grid-header-cell sortable" : "moravia-grid-header-cell");
	        return (React.createElement("div", {style: width, className: sortableClass, onClick: function () { return _this.props.onSort(); }}, React.createElement("span", {style: maxWidth, className: "title", title: this.props.title}, this.props.title), sortable));
	    };
	    HeaderCell.defaultProps = {
	        width: 100,
	        sortState: SortState.Disabled
	    };
	    return HeaderCell;
	}(React.Component));
	exports.HeaderCell = HeaderCell;
	var CheckboxCell = (function (_super) {
	    __extends(CheckboxCell, _super);
	    function CheckboxCell(props) {
	        _super.call(this, props);
	    }
	    CheckboxCell.prototype.render = function () {
	        var style = {
	            padding: '1px',
	            width: '24px'
	        };
	        return (React.createElement("div", {onClick: this.props.onCheck, style: style, className: "moravia-grid-row-cell"}, React.createElement("input", {type: "checkbox", checked: this.props.checked, readOnly: true})));
	    };
	    CheckboxCell.defaultProps = {
	        checked: false
	    };
	    return CheckboxCell;
	}(React.Component));
	exports.CheckboxCell = CheckboxCell;
	var CheckboxHeaderCell = (function (_super) {
	    __extends(CheckboxHeaderCell, _super);
	    function CheckboxHeaderCell(props) {
	        _super.call(this, props);
	    }
	    CheckboxHeaderCell.prototype.render = function () {
	        var style = {
	            padding: '1px',
	            width: '24px'
	        };
	        return (React.createElement("div", {onClick: this.props.onCheck, style: style, className: "moravia-grid-header-cell"}, React.createElement("input", {type: "checkbox", checked: this.props.checked, readOnly: true})));
	    };
	    CheckboxHeaderCell.defaultProps = {
	        checked: false
	    };
	    return CheckboxHeaderCell;
	}(React.Component));
	exports.CheckboxHeaderCell = CheckboxHeaderCell;


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
	var cell_1 = __webpack_require__(6);
	var Row = (function (_super) {
	    __extends(Row, _super);
	    function Row() {
	        _super.apply(this, arguments);
	    }
	    Row.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", {className: "moravia-grid-row"}, React.createElement(cell_1.CheckboxCell, {checked: this.props.selected, onCheck: this.props.onSelect}), this.props.columns.map(function (column) {
	            var value = _this.props.entity[column.key];
	            return (React.createElement(cell_1.Cell, {key: column.key, value: value, width: column.width}));
	        })));
	    };
	    return Row;
	}(React.Component));
	exports.Row = Row;


/***/ }
/******/ ]);
//# sourceMappingURL=react-grid.js.map
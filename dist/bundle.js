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
	    { key: "id" },
	    { key: "name" }
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
	    Adapter.prototype.find = function () {
	        return [
	            { id: "1", name: "Premysl" },
	            { id: "2", name: "Petra" }
	        ];
	    };
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
	var row_1 = __webpack_require__(5);
	var cell_1 = __webpack_require__(6);
	var Grid = (function (_super) {
	    __extends(Grid, _super);
	    function Grid() {
	        _super.apply(this, arguments);
	    }
	    Grid.prototype.render = function () {
	        var entities = this.props.adapter.find();
	        var columns = this.props.columns;
	        return (React.createElement("div", {className: "moravia-grid"}, React.createElement("div", {className: "moravia-grid-header"}, columns.map(function (column) {
	            var title = column.title || column.key;
	            return (React.createElement(cell_1.HeaderCell, {key: column.key, title: title, width: column.width}));
	        })), React.createElement("div", {className: "moravia-grid-body"}, entities.map(function (entity) {
	            return (React.createElement(row_1.Row, {key: entity.id, entity: entity, columns: columns}));
	        }))));
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
	var Row = (function (_super) {
	    __extends(Row, _super);
	    function Row() {
	        _super.apply(this, arguments);
	    }
	    Row.prototype.render = function () {
	        var entity = this.props.entity;
	        return (React.createElement("div", {className: "moravia-grid-row"}, this.props.columns.map(function (column) {
	            var value = entity[column.key];
	            return (React.createElement(cell_1.Cell, {key: column.key, value: value, width: column.width}));
	        })));
	    };
	    return Row;
	}(React.Component));
	exports.Row = Row;


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
	var HeaderCell = (function (_super) {
	    __extends(HeaderCell, _super);
	    function HeaderCell() {
	        _super.apply(this, arguments);
	    }
	    HeaderCell.prototype.render = function () {
	        var style = {
	            width: this.props.width + 'px'
	        };
	        return (React.createElement("div", {style: style, className: "moravia-grid-header-cell"}, this.props.title));
	    };
	    HeaderCell.defaultProps = {
	        width: 100
	    };
	    return HeaderCell;
	}(React.Component));
	exports.HeaderCell = HeaderCell;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
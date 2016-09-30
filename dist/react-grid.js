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
	var grid_1 = __webpack_require__(5);
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
	var Renderers = __webpack_require__(4);
	var ODataAdapter = (function () {
	    function ODataAdapter() {
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
	                buffer.push("$select=" + query.select.join(","));
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
	    ODataAdapter.prototype.getRows = function (query) {
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
	        { key: "Name", width: 140, sortable: true, render: Renderers.Strong, filterable: true },
	        { key: "Description", width: 250, sortable: true },
	        { key: "Rating", width: 70, textAlign: "right" }
	    ];
	    return ODataAdapter;
	}());
	exports.ODataAdapter = ODataAdapter;


/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var header_1 = __webpack_require__(6);
	var body_1 = __webpack_require__(11);
	var settings_1 = __webpack_require__(14);
	var Grid = (function (_super) {
	    __extends(Grid, _super);
	    function Grid(props) {
	        _super.call(this, props);
	        this.state = {
	            entities: [],
	            selection: [],
	            columns: [],
	            select: [],
	            inSettings: false
	        };
	        this.loadColumns();
	    }
	    Object.defineProperty(Grid.prototype, "columns", {
	        get: function () {
	            var _this = this;
	            return this.state.columns.filter(function (c) {
	                return _this.state.select.indexOf(c.key) != -1;
	            });
	        },
	        enumerable: true,
	        configurable: true
	    });
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
	                prevState.select = columns.map(function (c) { return c.key; });
	                return prevState;
	            }, function () { _this.loadRows(); });
	        });
	    };
	    Grid.prototype.loadRows = function () {
	        var _this = this;
	        var query = this.buildQuery();
	        this.props.adapter.getRows(query).then(function (entities) {
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
	        }, function () { _this.loadRows(); });
	    };
	    Grid.prototype.handleScroll = function (e) {
	        var scrollable = e.target;
	        var scrollTop = scrollable.scrollTop;
	        var scrollLeft = scrollable.scrollLeft;
	        var header = scrollable.getElementsByClassName('header')[0];
	        var body = scrollable.getElementsByClassName('body')[0];
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
	    Grid.prototype.handleContextMenu = function () {
	        this.setState(function (prevState, props) {
	            return prevState;
	        });
	    };
	    Grid.prototype.saveSettings = function (select) {
	        this.setState(function (prevState, props) {
	            prevState.inSettings = false;
	            prevState.select = select;
	            return prevState;
	        });
	    };
	    Grid.prototype.render = function () {
	        var _this = this;
	        var allSelected = this.state.selection.length > 0;
	        return (React.createElement("div", {className: "react-grid"}, 
	            React.createElement("div", {className: "scrollable", onScroll: function (e) { return _this.handleScroll(e); }}, 
	                React.createElement("div", {className: "inner"}, 
	                    React.createElement(header_1.Header, {columns: this.columns, selected: allSelected, onSelectAll: function () { return _this.handleSelectAll(); }, sorting: this.state.sorting, onSort: function (key) { return _this.handleSort(key); }, onContextMenu: function () { return _this.handleContextMenu(); }}), 
	                    React.createElement(body_1.Body, {columns: this.columns, entities: this.state.entities, selection: this.state.selection, onSelect: function (index) { return _this.handleSelect(index); }}))
	            ), 
	            React.createElement(settings_1.Settings, {visible: this.state.inSettings, columns: this.state.columns, select: this.state.select, onSave: function (select) { return _this.saveSettings(select); }})));
	    };
	    return Grid;
	}(React.Component));
	exports.Grid = Grid;


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
	var selection_1 = __webpack_require__(7);
	var sorting_1 = __webpack_require__(8);
	var filtering_1 = __webpack_require__(9);
	var headerCell_1 = __webpack_require__(10);
	var Header = (function (_super) {
	    __extends(Header, _super);
	    function Header() {
	        _super.apply(this, arguments);
	    }
	    Header.prototype.getSortState = function (column) {
	        if (column.sortable) {
	            if (this.props.sorting && this.props.sorting.key == column.key) {
	                return this.props.sorting.asc ? sorting_1.SortState.Ascending : sorting_1.SortState.Descending;
	            }
	            else {
	                return sorting_1.SortState.Enabled;
	            }
	        }
	        else {
	            return sorting_1.SortState.Disabled;
	        }
	    };
	    Header.prototype.getFilterState = function (column) {
	        if (column.filterable) {
	            return filtering_1.FilterState.Enabled;
	        }
	        else {
	            return filtering_1.FilterState.Disabled;
	        }
	    };
	    Header.prototype.onContextMenu = function (e) {
	        e.preventDefault();
	        this.props.onContextMenu();
	    };
	    Header.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", {className: "header", onContextMenu: this.onContextMenu.bind(this)}, 
	            React.createElement(selection_1.CheckboxHeaderCell, {checked: this.props.selected, onCheck: this.props.onSelectAll}), 
	            this.props.columns.map(function (column) {
	                var title = column.title || column.key;
	                return (React.createElement(headerCell_1.HeaderCell, {key: column.key, title: title, width: column.width, onSort: function () { return _this.props.onSort(column.key); }, sortState: _this.getSortState(column), filterState: _this.getFilterState(column)}));
	            })));
	    };
	    Header.defaultProps = {
	        sorting: {}
	    };
	    return Header;
	}(React.Component));
	exports.Header = Header;


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
	        return (React.createElement("div", {onClick: this.props.onCheck, style: this.style(), className: "cell"}, 
	            React.createElement("input", {type: "checkbox", checked: this.props.checked, readOnly: true})
	        ));
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
	    CheckboxHeaderCell.prototype.style = function () {
	        return {
	            padding: '1px',
	            width: '24px'
	        };
	    };
	    CheckboxHeaderCell.prototype.render = function () {
	        return (React.createElement("div", {onClick: this.props.onCheck, style: this.style(), className: "header-cell"}, 
	            React.createElement("input", {type: "checkbox", checked: this.props.checked, readOnly: true})
	        ));
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
	(function (SortState) {
	    SortState[SortState["Disabled"] = 0] = "Disabled";
	    SortState[SortState["Enabled"] = 1] = "Enabled";
	    SortState[SortState["Ascending"] = 2] = "Ascending";
	    SortState[SortState["Descending"] = 3] = "Descending";
	})(exports.SortState || (exports.SortState = {}));
	var SortState = exports.SortState;
	var Sortable = (function (_super) {
	    __extends(Sortable, _super);
	    function Sortable() {
	        _super.apply(this, arguments);
	    }
	    Sortable.prototype.render = function () {
	        switch (this.props.sortState) {
	            case SortState.Ascending:
	                return React.createElement("span", {className: "icon-sort-up"});
	            case SortState.Descending:
	                return React.createElement("span", {className: "icon-sort-down"});
	            case SortState.Enabled:
	                return React.createElement("span", {className: "icon-sort"});
	            default:
	                return null;
	        }
	    };
	    Sortable.defaultProps = {
	        sortState: SortState.Disabled
	    };
	    return Sortable;
	}(React.Component));
	exports.Sortable = Sortable;


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
	(function (FilterState) {
	    FilterState[FilterState["Disabled"] = 0] = "Disabled";
	    FilterState[FilterState["Enabled"] = 1] = "Enabled";
	    FilterState[FilterState["Active"] = 2] = "Active";
	})(exports.FilterState || (exports.FilterState = {}));
	var FilterState = exports.FilterState;
	var Filterable = (function (_super) {
	    __extends(Filterable, _super);
	    function Filterable() {
	        _super.apply(this, arguments);
	    }
	    Filterable.prototype.handleClick = function (e) {
	        e.stopPropagation();
	        this.props.onClick();
	    };
	    Filterable.prototype.render = function () {
	        var _this = this;
	        switch (this.props.filterState) {
	            case FilterState.Enabled:
	                return React.createElement("span", {className: "icon-filter", onClick: function (e) { return _this.handleClick(e); }});
	            case FilterState.Active:
	                return React.createElement("span", {className: "icon-filter active", onClick: function (e) { return _this.handleClick(e); }});
	            default:
	                return null;
	        }
	    };
	    Filterable.defaultProps = {
	        filterState: FilterState.Disabled
	    };
	    return Filterable;
	}(React.Component));
	exports.Filterable = Filterable;


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
	var sorting_1 = __webpack_require__(8);
	var filtering_1 = __webpack_require__(9);
	var HeaderCell = (function (_super) {
	    __extends(HeaderCell, _super);
	    function HeaderCell(props) {
	        _super.call(this, props);
	        this.state = {
	            filterOpen: false
	        };
	    }
	    Object.defineProperty(HeaderCell.prototype, "sortEnabled", {
	        get: function () {
	            return this.props.sortState != sorting_1.SortState.Disabled;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(HeaderCell.prototype, "filterEnabled", {
	        get: function () {
	            return this.props.filterState != filtering_1.FilterState.Disabled;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    HeaderCell.prototype.handleSort = function () {
	        if (this.sortEnabled && this.props.onSort != undefined) {
	            this.props.onSort();
	        }
	    };
	    HeaderCell.prototype.handleFilter = function () {
	        this.setState(function (state, props) {
	            state.filterOpen = !state.filterOpen;
	            return state;
	        });
	    };
	    HeaderCell.prototype.render = function () {
	        var _this = this;
	        var headerCellStyle = { width: this.props.width + 'px' };
	        var headerCellClasses = ["header-cell", "dropdown"];
	        var maxWidth = this.props.width - 10;
	        if (this.sortEnabled) {
	            headerCellClasses.push("sortable");
	            maxWidth = maxWidth - 17;
	        }
	        if (this.filterEnabled) {
	            maxWidth = maxWidth - 17;
	        }
	        if (this.state.filterOpen) {
	            headerCellClasses.push("open");
	        }
	        var titleStyle = { maxWidth: maxWidth + 'px' };
	        return (React.createElement("div", {style: headerCellStyle, className: headerCellClasses.join(" "), onClick: function () { return _this.handleSort(); }}, 
	            React.createElement("span", {style: titleStyle, className: "title", title: this.props.title}, this.props.title), 
	            React.createElement(sorting_1.Sortable, {sortState: this.props.sortState}), 
	            React.createElement(filtering_1.Filterable, {filterState: this.props.filterState, onClick: function () { return _this.handleFilter(); }}), 
	            React.createElement("div", {className: "content"}, 
	                React.createElement("input", {type: "text"})
	            )));
	    };
	    HeaderCell.defaultProps = {
	        width: 100
	    };
	    return HeaderCell;
	}(React.Component));
	exports.HeaderCell = HeaderCell;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var row_1 = __webpack_require__(12);
	var Body = (function (_super) {
	    __extends(Body, _super);
	    function Body() {
	        _super.apply(this, arguments);
	    }
	    Body.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", {className: "body"}, this.props.entities.map(function (entity, index) {
	            var selected = _this.props.selection.indexOf(entity.id) != -1;
	            return (React.createElement(row_1.Row, {key: entity.id, entity: entity, columns: _this.props.columns, selected: selected, onSelect: function () { return _this.props.onSelect(index); }}));
	        })));
	    };
	    return Body;
	}(React.Component));
	exports.Body = Body;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var cell_1 = __webpack_require__(13);
	var selection_1 = __webpack_require__(7);
	var Row = (function (_super) {
	    __extends(Row, _super);
	    function Row() {
	        _super.apply(this, arguments);
	    }
	    Row.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", {className: "row"}, 
	            React.createElement(selection_1.CheckboxCell, {checked: this.props.selected, onCheck: this.props.onSelect}), 
	            this.props.columns.map(function (column) {
	                var value = _this.props.entity[column.key];
	                return (React.createElement(cell_1.Cell, {key: column.key, value: value, width: column.width, textAlign: column.textAlign, render: column.render}));
	            })));
	    };
	    return Row;
	}(React.Component));
	exports.Row = Row;


/***/ },
/* 13 */
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
	        return (React.createElement("div", {style: this.style(), className: "cell"}, this.value()));
	    };
	    Cell.defaultProps = {
	        width: 100,
	        textAlign: "left"
	    };
	    return Cell;
	}(React.Component));
	exports.Cell = Cell;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	exports.OperatorSelect = function (value) {
	    return (React.createElement("select", {defaultValue: value}, 
	        React.createElement("option", {value: "eq"}, "equals"), 
	        React.createElement("option", {value: "ne"}, "not equals")));
	};
	exports.ValueField = function (value) {
	    return (React.createElement("input", {type: "text", defaultValue: value}));
	};
	var Settings = (function (_super) {
	    __extends(Settings, _super);
	    function Settings(props) {
	        _super.call(this, props);
	        this.state = {
	            select: props.select
	        };
	    }
	    Settings.prototype.handleSelect = function (key) {
	        this.setState(function (prevState, props) {
	            var index = prevState.select.indexOf(key);
	            if (index === -1) {
	                prevState.select.push(key);
	            }
	            else {
	                prevState.select.splice(index, 1);
	            }
	            return prevState;
	        });
	    };
	    Settings.prototype.render = function () {
	        var _this = this;
	        var style = {
	            display: this.props.visible ? "block" : "none"
	        };
	        return (React.createElement("div", {className: "settings", style: style}, 
	            React.createElement("div", {className: "title"}, "Grid Settings"), 
	            this.props.columns.map(function (column) {
	                var title = column.title || column.key;
	                var visible = _this.state.select.indexOf(column.key) != -1;
	                return (React.createElement("div", {key: column.key, className: "row"}, 
	                    React.createElement("input", {type: "checkbox", name: column.key, id: column.key, checked: visible, onClick: function () { return _this.handleSelect(column.key); }}), 
	                    React.createElement("label", {htmlFor: column.key}, title)));
	            }), 
	            React.createElement("div", {className: "actions"}, 
	                React.createElement("button", {onClick: function () { return _this.props.onSave(_this.state.select); }}, "Save")
	            )));
	    };
	    Settings.defaultProps = {
	        visible: false
	    };
	    return Settings;
	}(React.Component));
	exports.Settings = Settings;


/***/ }
/******/ ]);
//# sourceMappingURL=react-grid.js.map
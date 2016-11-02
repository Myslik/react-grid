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
	var grid_1 = __webpack_require__(4);
	var Renderers = __webpack_require__(14);
	var adapter = new odata_1.ODataAdapter("http://services.odata.org/V4/OData/OData.svc/Products", "ID", [
	    { key: "ID", width: 70 },
	    { key: "Name", width: 140, sortable: true, render: Renderers.Strong, filterable: true },
	    { key: "Description", width: 250, sortable: true },
	    { key: "Rating", width: 70, textAlign: "right" }
	]);
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
/***/ function(module, exports) {

	"use strict";
	var ODataAdapter = (function () {
	    function ODataAdapter(uri, identifier, columns) {
	        this.uri = uri;
	        this.identifier = identifier;
	        this.columns = columns;
	    }
	    ODataAdapter.prototype.getColumns = function () {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            resolve(_this.columns);
	        });
	    };
	    ODataAdapter.prototype.handleResponse = function (response) {
	        var _this = this;
	        return response.value.map(function (i) {
	            i["id"] = i[_this.identifier];
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
	        var uri = this.buildUri(this.uri, query);
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
	    return ODataAdapter;
	}());
	exports.ODataAdapter = ODataAdapter;


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
	var body_1 = __webpack_require__(11);
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
	            header.style.position = "auto";
	            header.style.top = "auto";
	            header.style.left = "auto";
	            header.style.width = "auto";
	        }
	    };
	    Grid.prototype.handleVisibility = function (key) {
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
	                    React.createElement(header_1.Header, {columns: this.state.columns, select: this.state.select, selected: allSelected, onSelectAll: function () { return _this.handleSelectAll(); }, sorting: this.state.sorting, onSort: function (key) { return _this.handleSort(key); }, onVisibility: function (key) { return _this.handleVisibility(key); }}), 
	                    React.createElement(body_1.Body, {columns: this.state.columns, select: this.state.select, entities: this.state.entities, selection: this.state.selection, onSelect: function (index) { return _this.handleSelect(index); }}))
	            )
	        ));
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
	var selection_1 = __webpack_require__(6);
	var sorting_1 = __webpack_require__(7);
	var filtering_1 = __webpack_require__(8);
	var headerCell_1 = __webpack_require__(9);
	var visibility_1 = __webpack_require__(10);
	var Header = (function (_super) {
	    __extends(Header, _super);
	    function Header(props) {
	        _super.call(this, props);
	        this.state = {
	            visibilityOpen: false
	        };
	    }
	    Object.defineProperty(Header.prototype, "columns", {
	        get: function () {
	            var _this = this;
	            return this.props.columns.filter(function (c) {
	                return _this.props.select.indexOf(c.key) != -1;
	            });
	        },
	        enumerable: true,
	        configurable: true
	    });
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
	    Header.prototype.handleVisibility = function (e) {
	        e.preventDefault();
	        this.setState(function (state, props) {
	            state.visibilityOpen = !state.visibilityOpen;
	            return state;
	        });
	    };
	    Header.prototype.render = function () {
	        var _this = this;
	        var headerClasses = ["header", "dropdown"];
	        if (this.state.visibilityOpen) {
	            headerClasses.push("open");
	        }
	        return (React.createElement("div", {className: headerClasses.join(" "), onContextMenu: function (e) { return _this.handleVisibility(e); }}, 
	            React.createElement(selection_1.CheckboxHeaderCell, {checked: this.props.selected, onCheck: this.props.onSelectAll}), 
	            this.columns.map(function (column) {
	                var title = column.title || column.key;
	                return (React.createElement(headerCell_1.HeaderCell, {key: column.key, title: title, width: column.width, onSort: function () { return _this.props.onSort(column.key); }, sortState: _this.getSortState(column), filterState: _this.getFilterState(column)}));
	            }), 
	            React.createElement(visibility_1.VisibilityDropdown, {columns: this.props.columns, select: this.props.select, onChange: this.props.onVisibility})));
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
	var Sortable = (function (_super) {
	    __extends(Sortable, _super);
	    function Sortable() {
	        _super.apply(this, arguments);
	    }
	    Sortable.prototype.render = function () {
	        switch (this.props.state) {
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
/* 8 */
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
	        switch (this.props.state) {
	            case FilterState.Enabled:
	                return React.createElement("span", {className: "icon-filter", onClick: function (e) { return _this.handleClick(e); }});
	            case FilterState.Active:
	                return React.createElement("span", {className: "icon-filter active", onClick: function (e) { return _this.handleClick(e); }});
	            default:
	                return null;
	        }
	    };
	    Filterable.defaultProps = {
	        state: FilterState.Disabled
	    };
	    return Filterable;
	}(React.Component));
	exports.Filterable = Filterable;
	var FilterDropdown = (function (_super) {
	    __extends(FilterDropdown, _super);
	    function FilterDropdown() {
	        _super.apply(this, arguments);
	    }
	    FilterDropdown.prototype.handleClick = function (e) {
	        e.stopPropagation();
	    };
	    FilterDropdown.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", {className: "content", onClick: function (e) { return _this.handleClick(e); }}, 
	            React.createElement("input", {type: "text"})
	        ));
	    };
	    return FilterDropdown;
	}(React.Component));
	exports.FilterDropdown = FilterDropdown;


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
	var sorting_1 = __webpack_require__(7);
	var filtering_1 = __webpack_require__(8);
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
	            React.createElement(sorting_1.Sortable, {state: this.props.sortState}), 
	            React.createElement(filtering_1.Filterable, {state: this.props.filterState, onClick: function () { return _this.handleFilter(); }}), 
	            React.createElement(filtering_1.FilterDropdown, null)));
	    };
	    HeaderCell.defaultProps = {
	        width: 100
	    };
	    return HeaderCell;
	}(React.Component));
	exports.HeaderCell = HeaderCell;


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
	var VisibilityDropdown = (function (_super) {
	    __extends(VisibilityDropdown, _super);
	    function VisibilityDropdown() {
	        _super.apply(this, arguments);
	    }
	    VisibilityDropdown.prototype.handleClick = function (e) {
	        e.stopPropagation();
	    };
	    VisibilityDropdown.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", {className: "content", onClick: function (e) { return _this.handleClick(e); }}, this.props.columns.map(function (column) {
	            var title = column.title || column.key;
	            var visible = _this.props.select.indexOf(column.key) != -1;
	            return (React.createElement("div", {key: column.key, className: "item"}, 
	                React.createElement("input", {type: "checkbox", name: column.key, id: column.key, checked: visible, onChange: function () { return _this.props.onChange(column.key); }}), 
	                React.createElement("label", {htmlFor: column.key}, title)));
	        })));
	    };
	    return VisibilityDropdown;
	}(React.Component));
	exports.VisibilityDropdown = VisibilityDropdown;


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
	    Object.defineProperty(Body.prototype, "columns", {
	        get: function () {
	            var _this = this;
	            return this.props.columns.filter(function (c) {
	                return _this.props.select.indexOf(c.key) != -1;
	            });
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Body.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", {className: "body"}, this.props.entities.map(function (entity, index) {
	            var selected = _this.props.selection.indexOf(entity.id) != -1;
	            return (React.createElement(row_1.Row, {key: entity.id, entity: entity, columns: _this.columns, selected: selected, onSelect: function () { return _this.props.onSelect(index); }}));
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
	var selection_1 = __webpack_require__(6);
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
	var React = __webpack_require__(1);
	exports.Strong = function (value) {
	    return React.createElement("strong", null, value);
	};
	exports.Em = function (value) {
	    return React.createElement("em", null, value);
	};


/***/ }
/******/ ]);
//# sourceMappingURL=react-grid.js.map
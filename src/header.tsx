import * as React from "react";
import { ISorting, IColumn } from "./adapter";
import { CheckboxHeaderCell } from "./selection";

export enum SortState {
    Disabled,
    Enabled,
    Ascending,
    Descending
}

export enum FilterState {
    Disabled,
    Enabled,
    Active
}

export interface IHeaderProps {
    columns: IColumn[];
    selected: boolean;
    onSelectAll: () => void;
    onSort: (key: string) => void;
    sorting?: ISorting;
    onContextMenu: () => void;
}

export class Header extends React.Component<IHeaderProps, void> {
    static defaultProps = {
        sorting: {}
    };

    getSortState(column: IColumn): SortState {
        if (column.sortable) {
            if (this.props.sorting && this.props.sorting.key == column.key) {
                return this.props.sorting.asc ? SortState.Ascending : SortState.Descending;
            } else {
                return SortState.Enabled;
            }
        } else {
            return SortState.Disabled;
        }
    }

    getFilterState(column: IColumn): FilterState {
        if (column.filterable) {
            return FilterState.Enabled;
        } else {
            return FilterState.Disabled;
        }
    }

    onContextMenu(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        this.props.onContextMenu();
    }

    render() {
        return (
            <div className="header" onContextMenu={this.onContextMenu.bind(this)}>
                <CheckboxHeaderCell checked={this.props.selected} onCheck={this.props.onSelectAll} />
                {
                    this.props.columns.map((column) => {
                        var title = column.title || column.key;
                        return (
                            <HeaderCell
                                key={column.key}
                                title={title}
                                width={column.width}
                                onSort={ () => this.props.onSort(column.key) }
                                sortState={this.getSortState(column)}
                                filterState={this.getFilterState(column)} />
                        );
                    })
                }
            </div>
        );
    }
}

export interface IHeaderCellProps {
    title: string;
    width?: number;
    onSort?: () => void;
    sortState?: SortState;
    filterState?: FilterState;
}

export interface IHeaderCellState {
    filterOpen: boolean;
}

export class HeaderCell extends React.Component<IHeaderCellProps, IHeaderCellState> {
    static defaultProps = {
        width: 100
    };

    constructor(props: IHeaderCellProps) {
        super(props);
        this.state = {
            filterOpen: false
        };
    }

    get sortEnabled(): boolean {
        return this.props.sortState != SortState.Disabled;
    }

    get filterEnabled(): boolean {
        return this.props.filterState != FilterState.Disabled;
    }

    handleSort() {
        if (this.sortEnabled && this.props.onSort != undefined) {
            this.props.onSort();
        }
    }

    handleFilter() {
        this.setState((state, props) => {
            state.filterOpen = !state.filterOpen;
            return state;
        });
    }

    render() {
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
        return (
            <div style={headerCellStyle} className={headerCellClasses.join(" ")} onClick={ () => this.handleSort() }>
                <span style={titleStyle} className="title" title={this.props.title}>{this.props.title}</span>
                <Sortable sortState={this.props.sortState} />
                <Filterable filterState={this.props.filterState} onClick={ () => this.handleFilter() } />
                <div className="content">
                    <input type="text" />
                </div>
            </div>
        );
    }
}

export interface ISortableProps {
    sortState?: SortState;
}

export class Sortable extends React.Component<ISortableProps, any> {
    static defaultProps = {
        sortState: SortState.Disabled
    };

    render() {
        switch (this.props.sortState) {
            case SortState.Ascending:
                return <span className="icon-sort-up"></span>
            case SortState.Descending:
                return <span className="icon-sort-down"></span>
            case SortState.Enabled:
                return <span className="icon-sort"></span>
            default:
                return null;
        }
    }
}

export interface IFilterableProps {
    filterState?: FilterState;
    onClick: () => void;
}

export class Filterable extends React.Component<IFilterableProps, any> {
    static defaultProps = {
        filterState: FilterState.Disabled
    };

    handleClick(e: React.MouseEvent<HTMLSpanElement>) {
        e.stopPropagation();
        this.props.onClick();
    }

    render() {
        switch (this.props.filterState) {
            case FilterState.Enabled:
                return <span className="icon-filter" onClick={ (e) => this.handleClick(e) }></span>
            case FilterState.Active:
                return <span className="icon-filter active" onClick={ (e) => this.handleClick(e) }></span>
            default:
                return null;
        }
    }
}
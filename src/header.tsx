/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import { ISorting, IColumn } from "./adapter";

export enum SortState {
    Disabled,
    Enabled,
    Ascending,
    Descending
}

export interface IHeaderProps {
    columns: IColumn[];
    selected: boolean;
    onSelectAll: () => void;
    onSort: (key: string) => void;
    sorting: ISorting;
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

    render() {
        return (
            <div className="react-grid-header">
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
                                sortState={this.getSortState(column)} />
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
}

export class HeaderCell extends React.Component<IHeaderCellProps, any> {
    static defaultProps = {
        width: 100,
        sortState: SortState.Disabled
    };

    get sortEnabled(): boolean {
        return this.props.sortState != SortState.Disabled;
    }

    handleSort() {
        if (this.sortEnabled) {
            this.props.onSort();
        }
    }

    render() {
        var width = { width: this.props.width + 'px' };
        var maxWidth = { maxWidth: this.props.width - 10 - (this.sortEnabled ? 17 : 0) + 'px' };
        var sortable;
        switch (this.props.sortState) {
            case SortState.Ascending:
                sortable = <span className="icon-sort-up"></span>
                break;
            case SortState.Descending:
                sortable = <span className="icon-sort-down"></span>
                break;
            case SortState.Enabled:
                sortable = <span className="icon-sort"></span>
                break;
        }
        var sortableClass = (this.sortEnabled ? "react-grid-header-cell sortable" : "react-grid-header-cell");
        return (
            <div style={width} className={sortableClass} onClick={ () => this.handleSort() }>
                <span style={maxWidth} className="title" title={this.props.title}>{this.props.title}</span>
                {sortable}
            </div>
        );
    }
}

export interface ICheckboxHeaderCellProps {
    checked: boolean;
    onCheck: () => void;
}

export class CheckboxHeaderCell extends React.Component<ICheckboxHeaderCellProps, void> {
    static defaultProps = {
        checked: false
    };

    constructor(props: ICheckboxHeaderCellProps) {
        super(props);
    }

    style(): React.CSSProperties {
        return {
            padding: '1px',
            width: '24px'
        };
    }

    render() {
        return (
            <div onClick={this.props.onCheck} style={ this.style() } className = "react-grid-header-cell">
                <input type="checkbox" checked={this.props.checked} readOnly />
            </div>
        );
    }
}
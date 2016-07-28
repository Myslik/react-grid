/// <reference path="../typings/index.d.ts" />

import * as React from "react";

export interface ICellProps {
    value: string;
    width?: number;
}

export class Cell extends React.Component<ICellProps, any> {
    static defaultProps = {
        width: 100
    };

    render() {
        var style = {
            width: this.props.width + 'px'
        }
        return (
            <div style={style} className="moravia-grid-row-cell">
                {this.props.value}
            </div>
        );
    }
}

export enum SortState {
    Disabled,
    Enabled,
    Ascending,
    Descending
}

export interface IHeaderCellProps {
    title: string;
    width?: number;
    onSort: () => void;
    sortState?: SortState;
}

export class HeaderCell extends React.Component<IHeaderCellProps, any> {
    static defaultProps = {
        width: 100,
        sortState: SortState.Disabled
    };

    render() {
        var sortEnabled = this.props.sortState != SortState.Disabled;
        var width = { width: this.props.width + 'px' };
        var maxWidth = { maxWidth: this.props.width - 10 - (sortEnabled ? 17 : 0) + 'px' };
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
        var sortableClass = (sortEnabled ? "moravia-grid-header-cell sortable" : "moravia-grid-header-cell");
        return (
            <div style={width} className={sortableClass} onClick={ () => this.props.onSort() }>
                <span style={maxWidth} className="title" title={this.props.title}>{this.props.title}</span>
                {sortable}
            </div>
        );
    }
}

export interface ICheckboxCellProps {
    checked: boolean;
    onCheck: () => void;
}

export class CheckboxCell extends React.Component<ICheckboxCellProps, void> {
    static defaultProps = {
        checked: false
    };

    constructor(props: ICheckboxCellProps) {
        super(props);
    }

    render() {
        var style = {
            padding: '1px',
            width: '24px'
        }
        return (
            <div onClick={this.props.onCheck} style={style} className = "moravia-grid-row-cell">
                <input type="checkbox" checked={this.props.checked} readOnly />
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

    constructor(props: ICheckboxCellProps) {
        super(props);
    }

    render() {
        var style = {
            padding: '1px',
            width: '24px'
        }
        return (
            <div onClick={this.props.onCheck} style={style} className = "moravia-grid-header-cell">
                <input type="checkbox" checked={this.props.checked} readOnly />
            </div>
        );
    }
}
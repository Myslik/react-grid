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

export interface IHeaderCellProps {
    title: string;
    width?: number;
}

export class HeaderCell extends React.Component<IHeaderCellProps, any> {
    static defaultProps = {
        width: 100
    };

    render() {
        var style = {
            width: this.props.width + 'px'
        }
        return (
            <div style={style} className="moravia-grid-header-cell">
                {this.props.title}
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
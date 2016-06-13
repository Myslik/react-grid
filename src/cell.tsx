/// <reference path="../typings/index.d.ts" />

import * as React from "react";

export interface ICellProps {
    value: string;
    width?: number;
}

export interface IHeaderCellProps {
    title: string;
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
            <div
                style={style}
                className="moravia-grid-row-cell">
                {this.props.value}
            </div>
        );
    }
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
            <div
                style={style}
                className="moravia-grid-header-cell">
                {this.props.title}
            </div>
        );
    }
}
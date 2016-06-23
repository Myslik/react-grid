/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import { IColumn } from "./column";
import { CheckboxHeaderCell, HeaderCell } from "./cell";

export interface IHeaderProps {
    columns: IColumn[];
    selected: boolean;
    onSelectAll: () => void;
}

export class Header extends React.Component<IHeaderProps, void> {
    render() {
        return (
            <div className="moravia-grid-header">
                <CheckboxHeaderCell checked={this.props.selected} onCheck={this.props.onSelectAll} />
                {
                    this.props.columns.map(function (column) {
                        var title = column.title || column.key;
                        return (
                            <HeaderCell
                                key={column.key}
                                title={title}
                                width={column.width} />
                        );
                    })
                }
            </div>
        );
    }
}
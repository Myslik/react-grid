/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import { IEntity } from "./entity";
import { IColumn } from "./column";
import { CheckboxCell, Cell } from "./cell";

export interface IRowProps {
    entity: IEntity,
    columns: IColumn[],
    selected: boolean,
    onSelect: () => void
}

export class Row extends React.Component<IRowProps, any> {
    render() {
        return (
            <div className="moravia-grid-row">
                <CheckboxCell checked={this.props.selected} onCheck={this.props.onSelect} />
                {
                    this.props.columns.map((column) => {
                        var value = this.props.entity[column.key];
                        return (
                            <Cell
                                key={column.key}
                                value={value}
                                width={column.width} />
                        );
                    })
                }
            </div>
        );
    }
}
/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import { IEntity } from "./entity";
import { IColumn } from "./column";
import { Cell } from "./cell";

export interface IRowProps {
    entity: IEntity,
    columns: IColumn[]
}

export class Row extends React.Component<IRowProps, any> {
    render() {
        var entity = this.props.entity;
        return (
            <div className="moravia-grid-row">
                { this.props.columns.map(function (column) {
                    var value = entity[column.key];
                    return (
                        <Cell
                            key={column.key}
                            value={value}
                            width={column.width} />
                    );
                }) }
            </div>
        );
    }
}
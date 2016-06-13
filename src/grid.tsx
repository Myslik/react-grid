/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import { Adapter } from "./adapter";
import { IColumn } from "./column";
import { Row } from "./row";
import { HeaderCell } from "./cell";

export interface IGridProps {
    adapter: Adapter;
    columns: IColumn[];
}

export interface IGridState {
    selection: string[];
}

export class Grid extends React.Component<IGridProps, IGridState> {
    constructor(props: IGridProps) {
        super(props);
        this.state.selection = [];
    }

    render() {
        var entities = this.props.adapter.find();
        var columns = this.props.columns;
        return (
            <div className="moravia-grid">
                <div className="moravia-grid-header">
                    { columns.map(function (column) {
                        var title = column.title || column.key;
                        return (
                            <HeaderCell
                                key={column.key}
                                title={title}
                                width={column.width} />
                        );
                    }) }
                </div>
                <div className="moravia-grid-body">
                    { entities.map(function (entity) {
                        return (
                            <Row
                                key={entity.id}
                                entity={entity}
                                columns={columns} />
                        );
                    }) }
                </div>
            </div>
        );
    }
}
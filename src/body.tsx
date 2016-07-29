/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import { IEntity, IColumn } from "./adapter";
import { Row } from "./row";

export interface IBodyProps {
    columns: IColumn[];
    entities: IEntity[];
    selection: string[];
    onSelect: (index: number) => void;
}

export class Body extends React.Component<IBodyProps, void> {
    render() {
        return (
            <div className="moravia-grid-body">
                {
                    this.props.entities.map((entity, index) => {
                        var selected = this.props.selection.indexOf(entity.id) != -1;
                        return (
                            <Row
                                key={entity.id}
                                entity={entity}
                                columns={this.props.columns}
                                selected={selected}
                                onSelect={ () => this.props.onSelect(index) } />
                        );
                    })
                }
            </div>
        );
    }
}
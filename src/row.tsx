import * as React from "react";
import { IRow, IColumn } from "./adapter";
import { Cell } from "./cell";
import { CheckboxCell } from "./selection";

export interface IRowProps {
    entity: IRow,
    columns: IColumn[],
    selected: boolean,
    onSelect: () => void
}

export class Row extends React.Component<IRowProps, any> {
    render() {
        return (
            <div className="row">
                <CheckboxCell checked={this.props.selected} onCheck={this.props.onSelect} />
                {
                    this.props.columns.map((column) => {
                        var value = this.props.entity[column.key];
                        return (
                            <Cell
                                key={column.key}
                                value={value}
                                width={column.width}
                                textAlign={column.textAlign}
                                render={column.render} />
                        );
                    })
                }
            </div>
        );
    }
}
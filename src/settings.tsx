/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import { IColumn } from "./adapter";
import { Cell, CheckboxCell } from "./cell";
import { HeaderCell } from "./header";

export interface ISettingsProps {
    visible: boolean;
    columns: IColumn[];
    select: string[];
    onChange: (select: string[]) => void;
}

export interface ISettingsState {
    
}

export class Settings extends React.Component<ISettingsProps, ISettingsState> {
    static defaultProps = {
        visible: false
    };

    constructor(props: ISettingsProps) {
        super(props);
    }

    handleSelect(key: string) {
        var select = this.props.select;
        var index = select.indexOf(key);

        if (index === -1) {
            select.push(key);
        } else {
            select.splice(index, 1);
        }
        this.props.onChange(select);
    }

    render() {
        var style = {
            display: this.props.visible ? "block" : "none"
        };
        return (
            <div className="react-grid-settings" style={style}>
                <div className="react-grid-header">
                    <div className="react-grid-header-cell">Grid Settings</div>
                </div>
                <div className="react-grid-header">
                    <HeaderCell title="Column name" width={164} />
                </div>
                <div className="react-grid-body">
                    {
                        this.props.columns.map((column) => {
                            var title = column.title || column.key;
                            var visible = this.props.select.indexOf(column.key) != -1;
                            return (
                                <div key={column.key} className="react-grid-row">
                                    <CheckboxCell checked={visible} onCheck={ () => this.handleSelect(column.key) } />
                                    <Cell value={title} width={140} />
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
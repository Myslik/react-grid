/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import { IColumn, IRender } from "./adapter";
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

export var OperatorSelect: IRender = (value: any) => {
    return (
        <select defaultValue={value}>
            <option value="eq">equals</option>
            <option value="ne">not equals</option>
        </select>
    );
}

export var ValueField: IRender = (value: any) => {
    return (
        <input type="text" defaultValue={value} />
    );
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
            <div className="settings" style={style}>
                <div className="header">
                    <div className="header-cell">Grid Settings</div>
                </div>
                <div className="header">
                    <HeaderCell title="Column name" width={164} />
                </div>
                <div className="body">
                    {
                        this.props.columns.map((column) => {
                            var title = column.title || column.key;
                            var visible = this.props.select.indexOf(column.key) != -1;
                            return (
                                <div key={column.key} className="row">
                                    <CheckboxCell checked={visible} onCheck={ () => this.handleSelect(column.key) } />
                                    <Cell value={title} width={140} />
                                    <Cell value={"eq"} width={100} render={OperatorSelect} />
                                    <Cell value={"value"} width={180} render={ValueField} />
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
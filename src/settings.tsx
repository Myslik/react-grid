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
                <div className="title">Grid Settings</div>
                {
                    this.props.columns.map((column) => {
                        var title = column.title || column.key;
                        var visible = this.props.select.indexOf(column.key) != -1;
                        return (
                            <div className="row">
                                <input type="checkbox" name={column.key} id={column.key} checked={visible} onClick={ () => this.handleSelect(column.key) } />
                                <label for={column.key}>{title}</label>
                            </div>
                        );
                    })
                }
                <div className="actions">
                    <button>Close</button>
                    <button>Save</button>
                </div>
            </div>
        );
    }
}
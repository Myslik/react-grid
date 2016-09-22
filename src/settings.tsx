import * as React from "react";
import { IColumn, IRender } from "./adapter";
import { Cell, CheckboxCell } from "./cell";
import { HeaderCell } from "./header";

export interface ISettingsProps {
    visible: boolean;
    columns: IColumn[];
    select: string[];
    onSave: (select: string[]) => void;
}

export interface ISettingsState {
    select: string[];
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
        this.state = {
            select: props.select
        };
    }

    handleSelect(key: string) {
        this.setState((prevState, props) => {
            var index = prevState.select.indexOf(key);
            if (index === -1) {
                prevState.select.push(key);
            } else {
                prevState.select.splice(index, 1);
            }
            return prevState;
        });
    }

    render() {
        var style = {
            display: this.props.visible ? "block" : "none"
        };
        return (
            <div className="settings" style={style}>
                <div className="title">
                    Grid Settings
                </div>
                {
                    this.props.columns.map((column) => {
                        var title = column.title || column.key;
                        var visible = this.state.select.indexOf(column.key) != -1;
                        return (
                            <div key={column.key} className="row">
                                <input type="checkbox" name={column.key} id={column.key} checked={visible} onClick={ () => this.handleSelect(column.key) } />
                                <label htmlFor={column.key}>{title}</label>
                            </div>
                        );
                    })
                }
                <div className="actions">
                    <button onClick={ () => this.props.onSave(this.state.select) }>Save</button>
                </div>
            </div>
        );
    }
}
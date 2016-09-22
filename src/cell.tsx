import * as React from "react";
import { IRender } from "./adapter";

export interface ICellProps {
    value: any;
    width?: number;
    textAlign?: any;
    render?: IRender;
}

export class Cell extends React.Component<ICellProps, any> {
    static defaultProps = {
        width: 100,
        textAlign: "left"
    };

    style(): React.CSSProperties {
        return {
            width: this.props.width + 'px',
            textAlign: this.props.textAlign
        };
    }

    value(): any {
        if (!!this.props.render) {
            return this.props.render(this.props.value);
        } else {
            return this.props.value;
        }
    }

    render() {
        var value = this.props.value;
        return (
            <div style={ this.style() } className="cell">
                { this.value() }
            </div>
        );
    }
}

export interface ICheckboxCellProps {
    checked: boolean;
    onCheck: () => void;
}

export class CheckboxCell extends React.Component<ICheckboxCellProps, void> {
    static defaultProps = {
        checked: false
    };

    constructor(props: ICheckboxCellProps) {
        super(props);
    }

    style(): React.CSSProperties {
        return {
            padding: '1px',
            width: '24px'
        };
    }

    render() {
        return (
            <div onClick={this.props.onCheck} style={ this.style() } className = "cell">
                <input type="checkbox" checked={this.props.checked} readOnly />
            </div>
        );
    }
}
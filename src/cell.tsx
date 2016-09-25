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
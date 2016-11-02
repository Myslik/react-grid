import * as React from "react";

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

export interface ICheckboxHeaderCellProps {
    checked: boolean;
    onCheck: () => void;
}

export class CheckboxHeaderCell extends React.Component<ICheckboxHeaderCellProps, void> {
    static defaultProps = {
        checked: false
    };

    constructor(props: ICheckboxHeaderCellProps) {
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
            <div onClick={this.props.onCheck} style={ this.style() } className = "header-cell">
                <input type="checkbox" checked={this.props.checked} readOnly />
            </div>
        );
    }
}
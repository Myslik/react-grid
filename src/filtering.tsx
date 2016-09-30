import * as React from "react";

export enum FilterState {
    Disabled,
    Enabled,
    Active
}

export interface IFilterableProps {
    filterState?: FilterState;
    onClick: () => void;
}

export class Filterable extends React.Component<IFilterableProps, any> {
    static defaultProps = {
        filterState: FilterState.Disabled
    };

    handleClick(e: React.MouseEvent<HTMLSpanElement>) {
        e.stopPropagation();
        this.props.onClick();
    }

    render() {
        switch (this.props.filterState) {
            case FilterState.Enabled:
                return <span className="icon-filter" onClick={(e) => this.handleClick(e)}></span>
            case FilterState.Active:
                return <span className="icon-filter active" onClick={(e) => this.handleClick(e)}></span>
            default:
                return null;
        }
    }
}

export class FilterDropdown extends React.Component<any, any> {
    handleClick(e: React.MouseEvent<HTMLSpanElement>) {
        e.stopPropagation();
    }
    
    render() {
        return (
            <div className="content" onClick={(e) => this.handleClick(e)}>
                <input type="text" />
            </div>
        );
    }
}
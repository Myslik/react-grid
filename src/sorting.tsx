import * as React from "react";

export enum SortState {
    Disabled,
    Enabled,
    Ascending,
    Descending
}

export interface ISortableProps {
    sortState?: SortState;
}

export class Sortable extends React.Component<ISortableProps, any> {
    static defaultProps = {
        sortState: SortState.Disabled
    };

    render() {
        switch (this.props.sortState) {
            case SortState.Ascending:
                return <span className="icon-sort-up"></span>
            case SortState.Descending:
                return <span className="icon-sort-down"></span>
            case SortState.Enabled:
                return <span className="icon-sort"></span>
            default:
                return null;
        }
    }
}
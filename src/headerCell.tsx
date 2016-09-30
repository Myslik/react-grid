import * as React from "react";
import { SortState, Sortable } from "./sorting";
import { FilterState, Filterable, FilterDropdown } from "./filtering";

export interface IHeaderCellProps {
    title: string;
    width?: number;
    onSort?: () => void;
    sortState?: SortState;
    filterState?: FilterState;
}

export interface IHeaderCellState {
    filterOpen: boolean;
}

export class HeaderCell extends React.Component<IHeaderCellProps, IHeaderCellState> {
    static defaultProps = {
        width: 100
    };

    constructor(props: IHeaderCellProps) {
        super(props);
        this.state = {
            filterOpen: false
        };
    }

    get sortEnabled(): boolean {
        return this.props.sortState != SortState.Disabled;
    }

    get filterEnabled(): boolean {
        return this.props.filterState != FilterState.Disabled;
    }

    handleSort() {
        if (this.sortEnabled && this.props.onSort != undefined) {
            this.props.onSort();
        }
    }

    handleFilter() {
        this.setState((state, props) => {
            state.filterOpen = !state.filterOpen;
            return state;
        });
    }

    render() {
        var headerCellStyle = { width: this.props.width + 'px' };
        var headerCellClasses = ["header-cell", "dropdown"];
        var maxWidth = this.props.width - 10;
        if (this.sortEnabled) {
            headerCellClasses.push("sortable");
            maxWidth = maxWidth - 17;
        }
        if (this.filterEnabled) {
            maxWidth = maxWidth - 17;
        }
        if (this.state.filterOpen) {
            headerCellClasses.push("open");
        }
        var titleStyle = { maxWidth: maxWidth + 'px' };
        return (
            <div style={headerCellStyle} className={headerCellClasses.join(" ")} onClick={ () => this.handleSort() }>
                <span style={titleStyle} className="title" title={this.props.title}>{this.props.title}</span>
                <Sortable sortState={this.props.sortState} />
                <Filterable filterState={this.props.filterState} onClick={ () => this.handleFilter() } />
                <FilterDropdown />
            </div>
        );
    }
}
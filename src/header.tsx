import * as React from "react";
import { ISorting, IColumn } from "./adapter";
import { CheckboxHeaderCell } from "./selection";
import { SortState } from "./sorting";
import { FilterState } from "./filtering";
import { HeaderCell } from "./headerCell";
import { VisibilityDropdown } from "./visibility";

export interface IHeaderProps {
    columns: IColumn[];
    select: string[];
    selected: boolean;
    onSelectAll: () => void;
    onSort: (key: string) => void;
    onVisibility: (key: string) => void;
    sorting?: ISorting;
}

export interface IHeaderState {
    visibilityOpen: boolean;
}

export class Header extends React.Component<IHeaderProps, IHeaderState> {
    static defaultProps = {
        sorting: {}
    };

    constructor(props: IHeaderProps) {
        super(props);
        this.state = {
            visibilityOpen: false
        };
    }

    get columns(): IColumn[] {
        return this.props.columns.filter((c) => {
            return this.props.select.indexOf(c.key) != -1;
        });
    }

    getSortState(column: IColumn): SortState {
        if (column.sortable) {
            if (this.props.sorting && this.props.sorting.key == column.key) {
                return this.props.sorting.asc ? SortState.Ascending : SortState.Descending;
            } else {
                return SortState.Enabled;
            }
        } else {
            return SortState.Disabled;
        }
    }

    getFilterState(column: IColumn): FilterState {
        if (column.filterable) {
            return FilterState.Enabled;
        } else {
            return FilterState.Disabled;
        }
    }

    handleVisibility(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        this.setState((state, props) => {
            state.visibilityOpen = !state.visibilityOpen;
            return state;
        });
    }

    render() {
        var headerClasses = ["header", "dropdown"];
        if (this.state.visibilityOpen) {
            headerClasses.push("open");
        }
        return (
            <div className={headerClasses.join(" ")} onContextMenu={ (e) => this.handleVisibility(e) }>
                <CheckboxHeaderCell checked={this.props.selected} onCheck={this.props.onSelectAll} />
                {
                    this.columns.map((column) => {
                        var title = column.title || column.key;
                        return (
                            <HeaderCell
                                key={column.key}
                                title={title}
                                width={column.width}
                                onSort={ () => this.props.onSort(column.key) }
                                sortState={this.getSortState(column)}
                                filterState={this.getFilterState(column)} />
                        );
                    })
                }
                <VisibilityDropdown 
                    columns={this.props.columns}
                    select={this.props.select}
                    onChange={this.props.onVisibility} />
            </div>
        );
    }
}
/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import { ISorting, IColumn } from "./adapter";
import { SortState, CheckboxHeaderCell, HeaderCell } from "./cell";

export interface IHeaderProps {
    columns: IColumn[];
    selected: boolean;
    onSelectAll: () => void;
    onSort: (key: string) => void;
    sorting: ISorting;
}

export class Header extends React.Component<IHeaderProps, void> {
    static defaultProps = {
        sorting: {}
    };

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

    render() {
        return (
            <div className="moravia-grid-header">
                <CheckboxHeaderCell checked={this.props.selected} onCheck={this.props.onSelectAll} />
                {
                    this.props.columns.map((column) => {
                        var title = column.title || column.key;
                        return (
                            <HeaderCell
                                key={column.key}
                                title={title}
                                width={column.width}
                                onSort={ () => this.props.onSort(column.key) }
                                sortState={this.getSortState(column)} />
                        );
                    })
                }
            </div>
        );
    }
}
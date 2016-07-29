/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import { IEntity, IColumn, IQuery, IFilter, ISorting, IAdapter } from "./adapter";
import { Header } from "./header";
import { Body } from "./body";

export interface IGridProps {
    adapter: IAdapter;
}

export interface IGridState {
    entities: IEntity[];
    selection: string[];
    columns: IColumn[];
    sorting?: ISorting;
    filter?: IFilter[];
    select?: string[];
}

export class Grid extends React.Component<IGridProps, IGridState> {
    constructor(props: IGridProps) {
        super(props);
        this.state = {
            entities: [],
            selection: [],
            columns: []
        };
        this.loadColumns();
    }

    buildQuery(): IQuery {
        return {
            skip: this.state.entities.length,
            sorting: this.state.sorting,
            filter: this.state.filter,
            select: this.state.select
        };
    }

    loadColumns() {
        this.props.adapter.getColumns().then(columns => {
            this.setState((prevState, props) => {
                prevState.columns = columns;
                return prevState;
            }, () => { this.load(); });
        });
    }

    load() {
        var query = this.buildQuery();
        this.props.adapter.find(query).then(entities => {
            this.setState((prevState, props) => {
                prevState.entities = entities;
                prevState.selection = [];
                return prevState;
            });
        });
    }

    handleSelect(index: number) {
        var entity = this.state.entities[index];
        this.setState((prevState, props) => {
            var selectionIndex = prevState.selection.indexOf(entity.id);
            if (selectionIndex != -1) {
                prevState.selection.splice(selectionIndex, 1);
            } else {
                prevState.selection.push(entity.id);
            }
            return prevState;
        });
    }

    handleSelectAll() {
        this.setState((prevState, props) => {
            if (prevState.selection.length > 0) {
                prevState.selection = [];
            } else {
                prevState.selection = this.state.entities.map((e) => e.id);
            }
            return prevState;
        });
    }

    handleSort(key: string) {
        this.setState((prevState, props) => {
            if (!prevState.sorting || prevState.sorting.key != key) {
                prevState.sorting = {
                    key: key,
                    asc: true
                };
            } else {
                if (prevState.sorting.asc == true) {
                    prevState.sorting.asc = false;
                } else {
                    prevState.sorting = undefined;
                }
            }
            prevState.entities = [];
            return prevState;
        }, () => { this.load(); });
    }

    handleScroll(e: React.UIEvent) {
        var scrollable = e.target as HTMLDivElement;
        var scrollTop = scrollable.scrollTop;
        var scrollLeft = scrollable.scrollLeft;

        var header = scrollable.getElementsByClassName('moravia-grid-header')[0] as HTMLDivElement;
        var body = scrollable.getElementsByClassName('moravia-grid-body')[0] as HTMLDivElement;
        if (scrollTop != 0 || scrollLeft != 0) {
            body.style.marginTop = header.offsetHeight + "px";
            header.style.position = "absolute";
            header.style.top = scrollTop + "px";
            header.style.left = "0";
            header.style.width = header.parentElement.clientWidth + "px";
        } else {
            body.style.marginTop = "0";
            header.style.position = "static";
            header.style.top = "auto";
            header.style.left = "auto";
            header.style.width = "auto";
        }
    }

    render() {
        var allSelected = this.state.selection.length > 0;
        return (
            <div className="moravia-grid">
                <div className="moravia-grid-scrollable" onScroll={ (e) => this.handleScroll(e) }>
                    <div className="moravia-grid-inner">
                        <Header
                            columns={this.state.columns}
                            selected={allSelected}
                            onSelectAll={ () => this.handleSelectAll() }
                            sorting={this.state.sorting}
                            onSort={ (key) => this.handleSort(key) } />
                        <Body
                            columns={this.state.columns}
                            entities={this.state.entities}
                            selection={this.state.selection}
                            onSelect={ (index) => this.handleSelect(index) } />
                    </div>
                </div>
            </div>
        );
    }
}
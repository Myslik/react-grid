/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import { IEntity, IQuery, IFilter, ISorting, IColumn, IAdapter } from "./adapter";
import { Header } from "./header";
import { Row } from "./row";

export interface IGridProps {
    adapter: IAdapter;
    columns: IColumn[];
}

export interface IGridState {
    entities: IEntity[];
    selection: string[];
    query?: IQuery;
}

export class Grid extends React.Component<IGridProps, IGridState> {
    constructor(props: IGridProps) {
        super(props);
        this.state = {
            entities: [],
            selection: [],
            query: {}
        };
    }

    componentDidMount(): void {
        this.load();
    }

    load() {
        this.props.adapter.find(this.state.query).then(data => {
            this.setState((prevState, props) => {
                prevState.entities = data.rows;
                prevState.query = data.next;
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
            delete prevState.query.skip;
            delete prevState.query.top;
            var query = prevState.query;
            if (!query.orderby || query.orderby.key != key) {
                query.orderby = {
                    key: key,
                    asc: true
                };
            } else {
                if (query.orderby.asc == true) {
                    query.orderby.asc = false;
                } else {
                    query.orderby = undefined;
                }
            }
            prevState.query = query;
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
                            columns={this.props.columns}
                            selected={allSelected}
                            onSelectAll={ () => this.handleSelectAll() }
                            sorting={this.state.query.orderby}
                            onSort={ (key) => this.handleSort(key) } />
                        <div className="moravia-grid-body">
                            {
                                this.state.entities.map((entity, index) => {
                                    var selected = this.state.selection.indexOf(entity.id) != -1;
                                    return (
                                        <Row
                                            key={entity.id}
                                            entity={entity}
                                            columns={this.props.columns}
                                            selected={selected}
                                            onSelect={ () => this.handleSelect(index) } />
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
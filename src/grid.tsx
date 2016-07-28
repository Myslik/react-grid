/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import { IEntity } from "./entity";
import { IColumn } from "./column";
import { Adapter } from "./adapter";
import { Header } from "./header";
import { Row } from "./row";

export interface IGridProps {
    adapter: Adapter;
    columns: IColumn[];
}

export interface IGridState {
    entities: IEntity[];
    selection: string[];
}

export class Grid extends React.Component<IGridProps, IGridState> {
    constructor(props: IGridProps) {
        super(props);
        this.state = {
            entities: [],
            selection: []
        };
    }

    componentDidMount(): void {
        this.props.adapter.find().then(entities => {
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

    render() {
        var allSelected = this.state.selection.length > 0;
        return (
            <div className="moravia-grid">
                <div className="moravia-grid-scrollable">
                    <div className="moravia-grid-inner">
                        <Header
                            columns={this.props.columns}
                            selected={allSelected}
                            onSelectAll={ () => this.handleSelectAll() } />
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
/// <reference path="../typings/globals/es6-promise/index.d.ts" />

export interface IEntity {
    [key: string]: any;
    id: string;
}

export interface IRender {
    (value: any): any;
}

export interface IColumn {
    key: string;
    title?: string;
    width?: number;
    textAlign?: any;
    sortable?: boolean;
    render?: IRender;
}

export interface ISorting {
    key: string;
    asc?: boolean;
}

export interface IFilter {
    key: string;
    operator: string;
    value: string;
}

export interface IQuery {
    skip?: number;
    top?: number;
    sorting?: ISorting;
    filter?: IFilter[];
    select?: string[];
}

export interface IAdapter {
    getColumns(): Promise<IColumn[]>;
    find(query?: IQuery): Promise<IEntity[]>;
}

export abstract class Adapter implements IAdapter {
    abstract getColumns(): Promise<IColumn[]>;
    abstract find(query?: IQuery): Promise<IEntity[]>;
}
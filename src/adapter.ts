export interface IRow {
    [key: string]: any;
    id: string;
}

export interface IRender {
    (value: any): JSX.Element;
}

export interface IColumn {
    key: string;
    title?: string;
    width?: number;
    textAlign?: any;
    sortable?: boolean;
    filterable?: boolean;
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
    getRows(query?: IQuery): Promise<IRow[]>;
}
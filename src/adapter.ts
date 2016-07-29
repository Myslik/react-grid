/// <reference path="../typings/globals/es6-promise/index.d.ts" />

export interface IEntity {
    [key: string]: any;
    id: string;
}

export interface IColumn {
    key: string;
    title?: string;
    width?: number;
    sortable?: boolean;
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
    columns: IColumn[];
    find(query?: IQuery): Promise<IEntity[]>;
}

export class Adapter implements IAdapter {
    public static DEFAULT_TOP: number = 25;
    public static CHANCE_SEED: number = 1337;

    public static COLUMNS: IColumn[] = [
        { key: "id", width: 70 },
        { key: "firstName", width: 120, sortable: true },
        { key: "lastName", width: 120, sortable: true },
        { key: "age", width: 70 },
        { key: "address", width: 200 }
    ];

    private defaultQuery(query?: IQuery): IQuery {
        if (!!query) {
            return {
                top: query.top || Adapter.DEFAULT_TOP,
                skip: query.skip || 0,
                sorting: query.sorting,
                filter: query.filter,
                select: query.select
            }
        } else {
            return { top: Adapter.DEFAULT_TOP, skip: 0 };
        }
    }

    get columns(): IColumn[] {
        return Adapter.COLUMNS;
    }

    public find(query?: IQuery): Promise<IEntity[]> {
        query = this.defaultQuery(query);
        return new Promise<IEntity[]>((resolve, reject) => {
            var chance = new Chance(Adapter.CHANCE_SEED);
            var rows = [];
            for (var i = 1; i <= query.top; i++) {
                rows.push({
                    id: i,
                    firstName: chance.first(),
                    lastName: chance.last(),
                    age: chance.age(),
                    address: chance.address()
                });
            }
            resolve(rows);
        });
    }
}
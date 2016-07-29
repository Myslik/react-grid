/// <reference path="../typings/globals/es6-promise/index.d.ts" />

import { IEntity } from "./entity";

export interface Query {
    skip?: number;
    top?: number;
    orderby?: Sorting;
    filter?: Filter[];
    select?: string[];
}

export interface Filter {
    key: string;
    operator: string;
    value: string;
}

export interface Sorting {
    key: string;
    asc?: boolean;
}

export interface Data {
    rows: IEntity[];
    next?: Query;
}

export interface IAdapter {
    find(query?: Query): Promise<Data>;
}

export class Adapter implements IAdapter {
    public static DEFAULT_TOP: number = 25;
    public static CHANCE_SEED: number = 1337;

    private defaultQuery(query?: Query): Query {
        if (!!query) {
            return {
                top: query.top || Adapter.DEFAULT_TOP,
                skip: query.skip || 0,
                orderby: query.orderby,
                filter: query.filter,
                select: query.select
            }
        } else {
            return { top: Adapter.DEFAULT_TOP, skip: 0 };
        }
    }

    public find(query?: Query): Promise<Data> {
        query = this.defaultQuery(query);
        return new Promise<Data>((resolve, reject) => {
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
            query.skip += query.top;
            resolve({ rows: rows, next: query });
        });
    }
}
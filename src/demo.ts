/// <reference path="../typings/globals/es6-promise/index.d.ts" />
/// <reference path="../typings/globals/chance/index.d.ts" />

import { IEntity, IColumn, IQuery, Adapter } from "./adapter";

export class DemoAdapter extends Adapter {
    public static CHANCE_SEED: number = 1337;

    public static COLUMNS: IColumn[] = [
        { key: "id", width: 70 },
        { key: "firstName", width: 120, sortable: true },
        { key: "lastName", width: 120, sortable: true },
        { key: "age", width: 70 },
        { key: "address", width: 200 }
    ];

    public getColumns(): Promise<IColumn[]> {
        return new Promise<IColumn[]>((resolve, reject) => {
            resolve(DemoAdapter.COLUMNS);
        });
    }

    public find(query?: IQuery): Promise<IEntity[]> {
        return new Promise<IEntity[]>((resolve, reject) => {
            var chance = new Chance(DemoAdapter.CHANCE_SEED);
            var rows = [];
            for (var i = 1; i <= 20; i++) {
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
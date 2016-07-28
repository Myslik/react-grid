/// <reference path="../typings/globals/es6-promise/index.d.ts" />

import { IEntity } from "./entity";
import { Promise } from "es6-promise";
import { Chance } from "chance";

export class Adapter {
    public find(): Promise<IEntity[]> {
        return new Promise<IEntity[]>((resolve, reject) => {
            var chance = Chance.Chance();
            var rows = [];
            for (var i = 1; i <= 25; i++) {
                rows.push({
                    id: i,
                    firstName: chance.first(),
                    lastName: chance.last()
                });
            }
            resolve(rows);
        });
    }
}
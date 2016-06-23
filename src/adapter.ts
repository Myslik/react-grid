/// <reference path="../typings/globals/es6-promise/index.d.ts" />

import { IEntity } from "./Entity";
import { Promise } from "es6-promise"

export class Adapter {
    public find(): Promise<IEntity[]> {
        return new Promise<IEntity[]>((resolve, reject) => {
            resolve([
                { id: "1", name: "Premysl" },
                { id: "2", name: "Petra" }
            ]);
        });
    }
}
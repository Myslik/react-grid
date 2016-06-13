import { IEntity } from "./Entity";

export class Adapter {
    public find(): IEntity[] {
        return [
            { id: "1", name: "Premysl" },
            { id: "2", name: "Petra" }
        ];
    }
}
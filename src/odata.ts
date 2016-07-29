/// <reference path="../typings/globals/es6-promise/index.d.ts" />

import { IEntity, IColumn, IQuery, Adapter } from "./adapter";

interface ODataResponse {
    value: any[];
}

export class ODataAdapter extends Adapter {
    public static URI: string = "http://services.odata.org/V4/OData/OData.svc/Products";
    public static COLUMNS: IColumn[] = [
        { key: "ID", width: 70 },
        { key: "Name", width: 140, sortable: true },
        { key: "Description", width: 250, sortable: true }
    ];

    public getColumns(): Promise<IColumn[]> {
        return new Promise<IColumn[]>((resolve, reject) => {
            resolve(ODataAdapter.COLUMNS);
        });
    }

    protected handleResponse(response: ODataResponse): IEntity[] {
        return response.value.map((i) => {
            i["id"] = i["ID"];
            return <IEntity>i;
        });
    }

    public find(query?: IQuery): Promise<IEntity[]> {
        query = this.defaultQuery(query);
        return new Promise<IEntity[]>((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.open("GET", ODataAdapter.URI, true);
            request.onload = () => {
                if (request.status >= 200 && request.status < 400) {
                    var response = <ODataResponse>JSON.parse(request.responseText);
                    var entities = this.handleResponse(response);
                    resolve(entities);
                } else {
                    reject();
                }
            };
            request.onerror = () => {
                reject();
            };
            request.send();
        });
    }
}
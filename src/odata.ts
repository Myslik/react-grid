import { IRow, IColumn, IQuery, IAdapter } from "./adapter";
import * as Renderers from "./render";

interface ODataResponse {
    value: any[];
}

export class ODataAdapter implements IAdapter {
    public static URI: string = "http://services.odata.org/V4/OData/OData.svc/Products";
    public static IDENTIFIER: string = "ID";
    public static COLUMNS: IColumn[] = [
        { key: "ID", width: 70 },
        { key: "Name", width: 140, sortable: true, render: Renderers.Strong },
        { key: "Description", width: 250, sortable: true },
        { key: "Rating", width: 70, textAlign: "right" }
    ];

    public getColumns(): Promise<IColumn[]> {
        return new Promise<IColumn[]>((resolve, reject) => {
            resolve(ODataAdapter.COLUMNS);
        });
    }

    protected handleResponse(response: ODataResponse): IRow[] {
        return response.value.map((i) => {
            i["id"] = i[ODataAdapter.IDENTIFIER];
            return <IRow>i;
        });
    }

    protected buildUri(uri: string, query?: IQuery): string {
        if (!!query) {
            var buffer: string[] = [];
            if (!!query.sorting) {
                buffer.push("$orderby=" + query.sorting.key + (query.sorting.asc === false ? " desc" : " asc"));
            }
            if (!!query.select) {
                buffer.push("$select=" + query.select.join(","));
            }
            if (!!query.top) {
                buffer.push("$top=" + query.top);
            }
            if (!!query.skip) {
                buffer.push("$skip=" + query.skip);
            }
            if (buffer.length > 0) {
                uri = uri + "?" + buffer.join("&");
            }
        }
        return uri;
    }

    public getRows(query?: IQuery): Promise<IRow[]> {
        var uri = this.buildUri(ODataAdapter.URI, query);
        return new Promise<IRow[]>((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.open("GET", uri, true);
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
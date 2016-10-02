/// <reference types="../node_modules/@types/jasmine" />

import { ODataAdapter } from "../src/odata"

describe('ODataAdapter', () => {
    var adapter = new ODataAdapter("http://services.odata.org/V4/OData/OData.svc/Products", "ID", [{ key: "ID" }]);

    it("should provide its column definitions", (done) => {
        adapter.getColumns().then(columns => {
            expect(columns.length).toBe(1);
            done();
        });
    });

    it("should get rows without query", (done) => {
        spyOn(XMLHttpRequest.prototype, 'open').and.callThrough()

        adapter.getRows().then(rows => {
            expect(XMLHttpRequest.prototype.open).toHaveBeenCalled();
            done();
        });
    });
});
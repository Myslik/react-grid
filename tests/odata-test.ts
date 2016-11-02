/// <reference types="..\node_modules\@types\jest" />

import { XMLHttpRequest } from "./XMLHttpRequest";
import { ODataAdapter } from "../src/odata";

it('ODataAdapter can be constructed', () => {
  var adapter = new ODataAdapter("http://services.odata.org/V4/OData/OData.svc/Products", "ID", []);
  expect(adapter).toBeDefined();
});

it('ODataAdapter can get rows', () => {
  var adapter = new ODataAdapter("http://services.odata.org/V4/OData/OData.svc/Products", "ID", []);
  adapter.getRows().then(rows => {
    expect(XMLHttpRequest.requests[0].method).toBe("GET");
    expect(XMLHttpRequest.requests[0].url).toBe("http://services.odata.org/V4/OData/OData.svc/Products");
  });
});
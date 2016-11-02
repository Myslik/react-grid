/// <reference types="..\node_modules\@types\jest" />

import { WebServer } from "./XMLHttpRequest";
import { ODataAdapter } from "../src/odata";

it('ODataAdapter can be constructed', () => {
  var adapter = new ODataAdapter("http://services.odata.org/V4/OData/OData.svc/Products", "ID", []);
  expect(adapter).toBeDefined();
});

it('ODataAdapter can get rows', () => {
  var adapter = new ODataAdapter("http://services.odata.org/V4/OData/OData.svc/Products", "ID", []);
  WebServer.handle = request => {
    expect(request.method).toBe("GET");
    expect(request.url).toBe("http://services.odata.org/V4/OData/OData.svc/Products");
  };
  adapter.getRows().then();
});
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ODataAdapter } from "./odata";
import { Grid } from "./grid";
import * as Renderers from "./render";

var adapter = new ODataAdapter("http://services.odata.org/V4/OData/OData.svc/Products", "ID", [
    { key: "ID", width: 70 },
    { key: "Name", width: 140, sortable: true, render: Renderers.Strong, filterable: true },
    { key: "Description", width: 250, sortable: true },
    { key: "Rating", width: 70, textAlign: "right" }
]);

ReactDOM.render(
    <Grid adapter={adapter} />,
    document.getElementById("example")
);
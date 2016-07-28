/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Adapter } from "./adapter";
import { Grid } from "./grid";

var adapter = new Adapter();
var columns = [
    { key: "id", width: 40 },
    { key: "firstName", width: 100 },
    { key: "lastName", width: 100 },
    { key: "age", width: 40 },
    { key: "address", width: 200 }
];

ReactDOM.render(    
    <Grid adapter={adapter} columns={columns} />,
    document.getElementById("example")
);
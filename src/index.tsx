/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Adapter } from "./adapter";
import { Grid } from "./grid";

var adapter = new Adapter();
var columns = [
    { key: "id", width: 50 },
    { key: "firstName", width: 200 },
    { key: "lastName", width: 200 }
];

ReactDOM.render(    
    <Grid adapter={adapter} columns={columns} />,
    document.getElementById("example")
);
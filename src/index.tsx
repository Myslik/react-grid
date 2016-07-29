/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Adapter } from "./adapter";
import { Grid } from "./grid";

var adapter = new Adapter();

ReactDOM.render(    
    <Grid adapter={adapter} />,
    document.getElementById("example")
);
/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import { DemoAdapter } from "./demo";
import { Grid } from "./grid";

var adapter = new DemoAdapter();

ReactDOM.render(    
    <Grid adapter={adapter} />,
    document.getElementById("example")
);
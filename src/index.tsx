import * as React from "react";
import * as ReactDOM from "react-dom";
import { ODataAdapter } from "./odata";
import { Grid } from "./grid";

var adapter = new ODataAdapter();

ReactDOM.render(    
    <Grid adapter={adapter} />,
    document.getElementById("example")
);
import * as React from "react";
import { IRender } from "./adapter";

export var Strong: IRender = (value: any) => {
    return <strong>{value}</strong>;
}

export var Em: IRender = (value: any) => {
    return <em>{value}</em>;
}
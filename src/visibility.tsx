import * as React from "react";
import { IColumn } from "./adapter";

export interface IVisibilityDropdownProps {
    columns: IColumn[];
    select: string[];
    onChange: (key: string) => void;
}

export class VisibilityDropdown extends React.Component<IVisibilityDropdownProps, any> {
    handleClick(e: React.MouseEvent<HTMLSpanElement>) {
        e.stopPropagation();
    }
    
    render() {
        return (
            <div className="content" onClick={(e) => this.handleClick(e)}>
                {
                    this.props.columns.map((column) => {
                        var title = column.title || column.key;
                        var visible = this.props.select.indexOf(column.key) != -1;
                        return (
                            <div key={column.key} className="item">
                                <input 
                                    type="checkbox" 
                                    name={column.key} 
                                    id={column.key} 
                                    checked={visible} 
                                    onChange={ () => this.props.onChange(column.key) } />
                                <label htmlFor={column.key}>{title}</label>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
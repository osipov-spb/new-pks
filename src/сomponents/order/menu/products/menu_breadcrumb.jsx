import React from "react";
import {Breadcrumb, Button, Tag, Row, Col} from 'antd'

class MenuBreadcrumb extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.title==undefined){
            this.state = {
                title: 'Неопределено',
                level: 0,
                itemIndex: 0,
                updatePath: undefined,
                openFolder: undefined
                }
        }else {
            this.state = {
                title: this.props.title,
                level: this.props.level,
                itemIndex: this.props.itemIndex,
                updatePath: this.props.updatePath,
                openFolder: this.props.openFolder
            }
        }
    }


    render() {
        return (
            <Breadcrumb.Item><a onClick={(e) => {
                this.state.updatePath(e, this.state.level, this.state.itemIndex)
                this.state.openFolder(e,0,true,this.state.itemIndex)
            }}>{this.state.title}</a></Breadcrumb.Item>
        )
    };
}

export default MenuBreadcrumb
import React from "react";
import {Breadcrumb, Button, Tag, Row, Col} from 'antd'

class MenuBreadcrumb extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.title==undefined){
            this.state = {
                title: 'Неопределено',
                level: 0,
                updatePath: undefined
                }
        }else {
            this.state = {
                title: this.props.title,
                level: this.props.level,
                updatePath: this.props.updatePath
            }
        }
    }


    render() {
        return (
            <Breadcrumb.Item><a onClick={(e) => {this.state.updatePath(e, this.state.level)}}>{this.state.title}</a></Breadcrumb.Item>
        )
    };
}

export default MenuBreadcrumb
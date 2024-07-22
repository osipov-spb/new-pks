import React from "react";
import {Carousel, Progress, Space} from "antd";
import OrdersList from "./list/orders_list";
import Order from "./order/order";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {
        const page_type = 'list'

        this.setState({
            page_type: page_type
        })

        window.show_page = (page_type) => {
            this.setState({
                page_type: page_type
            })
        }

        window.setSessionData = (data) => {
            this.setState({
                page_type: page_type
            })
        }

        window.getSessionData = (data) => {
            this.setState({
                page_type: page_type
            })
        }
    }

    render() {
        if (this.state.page_type=='list') {
            return (
                <OrdersList/>
            );
        }else if (this.state.page_type=='order'){
            return (
                <Order/>
            )
        }
    }
}

export default Main;
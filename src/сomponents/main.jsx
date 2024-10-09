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
        const order_str = ''

        this.setState({
            page_type: page_type
        })

        window.show_page = (page_type, order_number) => {
            this.setState({
                page_type: page_type,
                order_number: order_number
            })
        }

        window.current_page = () => {
            return this.state.page_type;
        }

        window.open_order = (order_str) => {
            this.setState({
                page_type: 'order',
                order_str: order_str
            })
        }
    }


    render() {
        if (this.state.page_type == 'list') {
            return (
                <OrdersList/>
            );
        } else if (this.state.page_type == 'order') {
            return (
                <Order order_str={this.state.order_str}/>
            )
        }
    }
}

export default Main;
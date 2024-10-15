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

        window.show_page = (page_type, order_number) => {
            this.setState({
                page_type: page_type,
                order_number: order_number,
            })
        }

        window.current_page = () => {
            return this.state.page_type;
        }

        window.open_order = (order_data, params) => {
            this.setState({
                page_type: 'order',
                order_data: order_data,
                params : params
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
                <Order order_str={this.state.order_data} params_str={this.state.params}/>
            )
        }
    }
}

export default Main;
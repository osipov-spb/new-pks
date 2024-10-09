import React from 'react'
import {Space , Typography} from 'antd'


const { Title } = Typography;

class _OrderTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderNumber: this.props.order_number
        }
    }
    componentDidMount() {
        // this.setState({
        //     orderNumber: this.state.orderNumber
        // })

        // window.order_title_SetOrderNumber = (orderNumber) => {
        //     this.setState(({orderNumber: orderNumber}));
        //     return true}
    }
    render() {
        if (!this.state.orderNumber == ''){
            return (
                <div>
                    <Space direction="horizontal">
                        <Title level={4}>Заказ {this.state.orderNumber}</Title>
                    </Space>
                </div>
            )
        }else{
            return (
                <div>
                    <Space direction="horizontal">
                        <Title level={4}>Новый заказ</Title>
                    </Space>
                </div>
            )
        }
    }
}

export default _OrderTitle;
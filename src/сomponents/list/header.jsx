import React from 'react'
import {Space , Typography} from 'antd'


const { Title } = Typography;

class _Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        const storeName = ""

        this.setState({
            subtitle: storeName
        })

    window.header_SetStoreName = (storeName) => {
            this.setState(({subtitle: storeName}));
            return true}
    }
    render() {
        return (
            <div>
                <Space direction="horizontal">
                    <Title level={4}>Заказы: {this.state.subtitle}</Title>
                </Space>
            </div>

        )
    }
}

export default _Header;
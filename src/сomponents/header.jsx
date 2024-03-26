import React from 'react'
import {PageHeader, Space , Typography} from 'antd'

const {Text, Title } = Typography;

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
            return true        }
    }

    render() {
        return (
            <div>
                <Space direction="horizontal">
                    <Title level={3}>Заказы</Title>
                    <Text type="secondary">{this.state.subtitle}</Text>
                </Space>
            </div>
        )
    }
}

export default _Header;
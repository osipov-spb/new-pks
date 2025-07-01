import React from 'react'
import {Button, Card, Divider, Space, Typography} from 'antd'
import {
    BarsOutlined,
    FileTextOutlined, ShopFilled,
    ShoppingCartOutlined,
    ShoppingFilled,
    ShoppingOutlined,
    TagsOutlined
} from "@ant-design/icons";


const { Title, Text } = Typography;

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
            <Title
                level={4}
                style={{
                    position: "relative",
                    display: "inline-block",
                    padding: "0 8px 4px 8px"
                }}
            >
                <ShoppingFilled style={{ marginRight: 8, color: "#1890ff" }} />
                <Text style={{'fontSize': '18px'}}>Заказы <ShopFilled style={{ marginLeft: 30, marginRight: 8, color: "#1890ff" }}/>{this.state.subtitle}</Text>

                <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: 2,
                    background: "linear-gradient(90deg, #1890ff, transparent)",
                    borderRadius: 2
                }} />
            </Title>
        )
    }
}

export default _Header;
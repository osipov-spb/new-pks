import React from 'react'
import {Typography} from 'antd'
import {ShopFilled, ShoppingFilled} from "@ant-design/icons";


const { Title, Text } = Typography;

class TableHeader extends React.Component {
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
                <Text style={{'fontSize': '18px'}}>Заказы <ShopFilled style={{ marginLeft: 15, marginRight: 8, color: "#1890ff" }}/>{this.state.subtitle}</Text>

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

export default TableHeader;
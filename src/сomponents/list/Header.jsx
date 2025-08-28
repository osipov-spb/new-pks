import React from 'react'
import {Typography} from 'antd'
import {ShopFilled, ShoppingFilled, UserOutlined} from "@ant-design/icons";

const { Title, Text } = Typography;

class TableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subtitle: "",
            adminName: ""
        }
    }

    componentDidMount() {
        window.header_SetStoreData = (storeName, adminName = "") => {
            this.setState({
                subtitle: storeName,
                adminName: adminName
            });
            return true;
        }
    }

    render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <Title
                    level={4}
                    style={{
                        position: "relative",
                        display: "inline-block",
                        padding: "0 8px 4px 8px",
                        marginBottom: 4
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

                {this.state.adminName && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '12px',
                        color: '#666',
                        marginTop: 2,
                        paddingLeft: 8
                    }}>
                        <UserOutlined style={{ marginRight: 4, fontSize: '10px' }} />
                        <Text type="secondary">Администратор: {this.state.adminName}</Text>
                    </div>
                )}

                {!this.state.adminName && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '12px',
                        color: '#666',
                        marginTop: 2,
                        paddingLeft: 8
                    }}>
                        <UserOutlined style={{ marginRight: 4, fontSize: '10px' }} />
                        <Text type="secondary">Администратор не выбран</Text>
                    </div>
                )}
            </div>
        )
    }
}

export default TableHeader;
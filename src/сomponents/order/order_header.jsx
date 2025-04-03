import React from 'react';
import {Button, Row, Col, Space, Typography, Input} from "antd";
import {
    ClockCircleOutlined,
    FileOutlined,
    PercentageOutlined,
    ProfileOutlined,
    RollbackOutlined
} from "@ant-design/icons";
import _OrderTitle from "./order_title";
import _PackageSwitch from "./buttons/package_switch";
import ClientSelectForm from "./clientSelector/clientSelector";
import PromoCodeModal from "./cert/cert";

const { Text } = Typography;

class _OrderHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTemporaryOrder: false,
            isBSO: false
        };
    }

    render() {
        return (
            <div style={{
                padding: '8px 12px',
                background: '#fff',
                borderBottom: '1px solid #f0f0f0'
            }}>
                {/* Заголовок заказа */}
                <div style={{ marginBottom: 8 }}>
                    <_OrderTitle order_number={this.props.order_data.order_number} />
                </div>

                {/* Панель с кнопками */}
                <Row align="middle" justify="space-between">
                    <Col>
                        <Space size={6} wrap>
                            <_PackageSwitch size="middle" />

                            <Button
                                size="middle"
                                type={this.state.isTemporaryOrder ? 'primary' : 'default'}
                                icon={<ClockCircleOutlined />}
                                onClick={() => this.setState({ isTemporaryOrder: !this.state.isTemporaryOrder })}
                            >
                                Временной
                            </Button>

                            <Button
                                size="middle"
                                type={this.state.isBSO ? 'primary' : 'default'}
                                icon={<FileOutlined />}
                                onClick={() => this.setState({ isBSO: !this.state.isBSO })}
                            >
                                БСО
                            </Button>

                            <PromoCodeModal size="middle" />
                            <ClientSelectForm size="middle" />

                            <Button size="middle" icon={<PercentageOutlined />}>
                                Акции
                            </Button>
                        </Space>
                    </Col>

                    <Col>
                        <Space size={6}>
                            <Button size="middle" icon={<ProfileOutlined />}>Акт</Button>
                            <Button size="middle" icon={<RollbackOutlined />}>Возврат</Button>
                        </Space>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default _OrderHeader;
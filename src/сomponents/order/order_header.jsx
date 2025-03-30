import {Button, Col, Row, Space, Switch, Typography} from "antd";
import React, {useState} from "react";
import _OrderTitle from "./order_title";
import _PackageSwitch from "./buttons/package_switch";
import {
    CheckOutlined,
    ClockCircleOutlined,
    CloseOutlined,
    FileOutlined,
    PercentageOutlined, ProfileOutlined, RollbackOutlined,
    UserOutlined
} from "@ant-design/icons";
import ClientSelectForm from "./clientSelector/clientSelector";
import PromoCodeModal from "./cert/cert";


const {Text, Link} = Typography;
const [m_size, setSize] = 'middle';
class _OrderHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    showListOnClick() {
        window.show_page('list')
    };

    render()
    {
        return (<>
            <Row align="bottom">
                <Col span={18}>
                    <Space direction="vertical" size={m_size}>
                        <_OrderTitle order_number={this.props.order_data.order_number}/>
                        <Space size="small">
                            <_PackageSwitch/>
                            <Button href="#" size={m_size}>
                                <Space size="small">
                                <ClockCircleOutlined /> Временной заказ
                                <Switch size="small"
                                    checkedChildren={<CheckOutlined />}
                                    unCheckedChildren={<CloseOutlined />}
                                    defaultChecked
                                />
                                </Space>
                            </Button>
                            <Button href="#" size={m_size}>
                                <Space size="small">
                                    <FileOutlined /> БСО
                                    <Switch size="small"
                                            checkedChildren={<CheckOutlined />}
                                            unCheckedChildren={<CloseOutlined />}
                                            defaultChecked
                                    />
                                </Space>

                            </Button>
                            {/*<Button href="#"*/}
                            {/*        size={m_size}*/}
                            {/*        data-button-id="order-header-guest">*/}
                            {/*    <Space size="small">*/}
                            {/*    <UserOutlined />*/}
                            {/*    Гость*/}
                            {/*    </Space>*/}
                            {/*</Button>*/}
                            <PromoCodeModal/>
                            <ClientSelectForm/>

                            <Button href="#"
                                    size={m_size}
                                    data-button-id="order-header-promo">
                                <Space size="small">
                                <PercentageOutlined />
                                Акции
                                </Space>
                            </Button>
                            {/*<Button href="#" data-button-id='save-order' size={m_size}>*/}
                            {/*    <Space size="small">*/}
                            {/*        <RollbackOutlined />*/}
                            {/*        Сохранить*/}
                            {/*    </Space>*/}
                            {/*</Button>*/}

                            {/*    <Button href="#" data-button-id='order-back' size={m_size}>*/}
                            {/*        <Space size="small">*/}
                            {/*            <RollbackOutlined />*/}
                            {/*            Отмена*/}
                            {/*        </Space>*/}
                            {/*    </Button>*/}

                        </Space>
                    </Space>
                </Col>
                <Col span={6}>
                    <Space size="small">
                        <Button href="#" size={m_size}>
                            <Space size="small">
                            <ProfileOutlined />
                            Акт списания
                            </Space>
                        </Button>
                        <Button href="#"  size={m_size}>
                            <Space size="small">
                            <RollbackOutlined />
                            Возврат
                            </Space>
                        </Button>
                    </Space>
                </Col>
            </Row>
        </>
    )
}
}


export default _OrderHeader
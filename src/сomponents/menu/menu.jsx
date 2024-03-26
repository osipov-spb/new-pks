import {Button, Col, Row, Space, Typography} from "antd";
import {
    CompassOutlined,
    FilterOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    StopOutlined
} from "@ant-design/icons";
import React, {useState} from "react";
import _FunctionsButton from "./buttons/functions";
import Motivation from "./motivation";
import _Header from "../header";


const {Text, Link} = Typography;
const _Menu = () => {
    const [size, setSize] = useState('large');
    return (<>
            <Row align="bottom">
                <Col span={18}>
                    <Space direction="vertical" size="large">
                        <_Header/>
                        <Space size="small">
                            <Button type="primary" href="#" data-button-id="menu-create-order" icon={<PlusOutlined/>}
                                    size={size}>
                                Создать заказ
                            </Button>
                            <Button icon={<FilterOutlined/>} size={size}/>
                            <_FunctionsButton/>
                            <Button href="#" data-button-id="menu-info" icon={<InfoCircleOutlined/>} size={size}>
                                Инфо
                            </Button>
                            <Button href="#" data-button-id="menu-maps" icon={<CompassOutlined/>} size={size}>
                                Карты
                            </Button>
                            <Button href="#" data-button-id="menu-stop" icon={<StopOutlined/>} size={size} danger>
                                Стоп
                            </Button>
                        </Space>
                    </Space>
                </Col>
                <Col span={6}>
                    <Motivation/>
                </Col>
            </Row>
        </>
    )
}

export default _Menu
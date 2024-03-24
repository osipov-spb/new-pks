import {Button, Card, Col, Row, Space} from "antd";
import {
    CompassOutlined,
    FilterOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    SettingOutlined,
    StopOutlined
} from "@ant-design/icons";
import Divider from "./Divider";
import React, {useState} from "react";

const _Menu = () => {
    const [size, setSize] = useState('large');
    return (<>
            <Row>
                <Col span={18}>
                    <Space size="small">
                        <Button type="primary" icon={<PlusOutlined/>} size={size}>
                            Создать заказ
                        </Button>
                        <Button icon={<FilterOutlined/>} size={size}/>

                        <Button icon={<SettingOutlined/>} size={size}>
                            Функции
                        </Button>
                        <Button icon={<InfoCircleOutlined/>} size={size}>
                            Инфо
                        </Button>
                        <Button icon={<CompassOutlined/>} size={size}>
                            Карты
                        </Button>
                        <Button icon={<StopOutlined/>} size={size} danger>
                            Стоп
                        </Button>
                    </Space>
                </Col>
                <Col span={6}>
                    <Card title="Лидер продаж: Т55, Гостинный" bordered={false}>
                        План выполнен на 67%
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default _Menu
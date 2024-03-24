import {Button, Row, Space} from "antd";
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
    return (
        <row>
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
        </row>
    )
}

export default _Menu
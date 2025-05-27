import React, { useState } from 'react';
import { Button, Dropdown, Menu, Tag } from 'antd';
import { ShopOutlined, CarryOutOutlined, RocketOutlined } from '@ant-design/icons';

const _PackageSwitch = ({ updatePackage, initialPackageType = 'in_store' }) => {
    const [packageType, setPackageType] = useState(initialPackageType);
    const [visible, setVisible] = useState(false);

    const handleMenuClick = (e) => {
        setPackageType(e.key);
        // Вызываем callback для обновления package в родительском компоненте
        if (updatePackage) {
            updatePackage(e.key);
        }
        setVisible(false);
    };


    const handleVisibleChange = (flag) => {
        setVisible(flag);
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="in_store" icon={<ShopOutlined />}>
                Зал
            </Menu.Item>
            <Menu.Item key="take_away" icon={<CarryOutOutlined />}>
                На вынос
            </Menu.Item>
            <Menu.Item key="delivery" icon={<RocketOutlined />}>
                Доставка
            </Menu.Item>
        </Menu>
    );

    const getButtonText = () => {
        switch(packageType) {
            case 'in_store': return 'Зал';
            case 'take_away': return 'На вынос';
            case 'delivery': return 'Доставка';
            default: return 'Выберите тип';
        }
    };

    const getButtonIcon = () => {
        switch(packageType) {
            case 'in_store': return <ShopOutlined />;
            case 'take_away': return <CarryOutOutlined />;
            case 'delivery': return <RocketOutlined />;
            default: return <ShopOutlined />;
        }
    };

    return (
        <Dropdown
            overlay={menu}
            trigger={['click']}
            visible={visible}
            onVisibleChange={handleVisibleChange}
        >
            <Button
                type="default"
                icon={getButtonIcon()}
                style={{ minWidth: '120px' }}
            >
                {getButtonText()}
            </Button>
        </Dropdown>
    );
};

export default _PackageSwitch;
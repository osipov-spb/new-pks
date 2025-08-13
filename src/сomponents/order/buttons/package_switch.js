import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Menu, Tag } from 'antd';
import { ShopOutlined, CarryOutOutlined, RocketOutlined } from '@ant-design/icons';

const _PackageSwitch = ({ updatePackage, initialPackageType = 'in_store' }) => {
    const [packageType, setPackageType] = useState(initialPackageType);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Добавляем функцию в window для внешнего управления
        window.setPackageType = (type) => {
            if (['in_store', 'take_away', 'delivery'].includes(type)) {
                setPackageType(type);
                if (updatePackage) {
                    updatePackage(type);
                }
            } else {
                console.warn(`Invalid package type: ${type}. Allowed values: in_store, take_away, delivery`);
            }
        };

        // Очистка при размонтировании
        return () => {
            delete window.setPackageType;
        };
    }, [updatePackage]);

    const handleMenuClick = (e) => {
        setPackageType(e.key);
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
            <Menu.Item
                key="in_store"
                icon={<ShopOutlined />}
            >
                <a data-button-id='package-switch-in_store'>Зал</a>
            </Menu.Item>
            <Menu.Item
                key="take_away"
                icon={<CarryOutOutlined/>}
            >
                <a data-button-id='package-switch-take_away'>На вынос</a>
            </Menu.Item>
            <Menu.Item
                key="delivery"
                icon={<RocketOutlined/>}
            >
                <a data-button-id='package-switch-delivery'>Доставка</a>
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

    const getButtonDataId = () => {
        switch(packageType) {
            case 'in_store': return 'package-switch-in_store';
            case 'take_away': return 'package-switch-take_away';
            case 'delivery': return 'package-switch-delivery';
            default: return '';
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
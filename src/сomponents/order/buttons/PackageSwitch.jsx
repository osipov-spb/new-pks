// noinspection XmlDeprecatedElement

import React, {useEffect, useState} from 'react';
import {Button, Dropdown, Menu} from 'antd';
import {CarryOutOutlined, RocketOutlined, ShopOutlined} from '@ant-design/icons';

const PackageSwitch = ({ updatePackage, initialPackageType = 'in_store' }) => {
    const [packageType, setPackageType] = useState(initialPackageType);
    const [open, setOpen] = useState(false); // Заменили visible на open

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
        setOpen(false); // Заменили setVisible на setOpen
    };

    const handleOpenChange = (flag) => {
        setOpen(flag); // Заменили setVisible на setOpen
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item
                key="in_store"
                icon={<ShopOutlined />}
            >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href='#' data-button-id='package-switch-in_store'>Зал</a>
            </Menu.Item>
            <Menu.Item
                key="take_away"
                icon={<CarryOutOutlined/>}
            >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href='#' data-button-id='package-switch-take_away'>На вынос</a>
            </Menu.Item>
            <Menu.Item
                key="delivery"
                icon={<RocketOutlined/>}
            >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href='#' data-button-id='package-switch-delivery'>Доставка</a>
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
            open={open} // Заменили visible на open
            onOpenChange={handleOpenChange} // Заменили onVisibleChange на onOpenChange
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

export default PackageSwitch;
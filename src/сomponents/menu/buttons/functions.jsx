import {Button, Dropdown} from 'antd';
import React, {useState} from 'react';
import {SettingOutlined} from "@ant-design/icons";

const items = [
    {
        key: 'menu-functions-reports',
        label: 'Отчеты',
        children: [
            {
                key: 'menu-functions-reports-orders-register',
                label: 'Реестр заказов',
                children: [
                    {
                        key: 'menu-functions-reports-orders-register-orders-register',
                        label: <a data-button-id='menu-functions-reports-orders-register-orders-register'>Реестр
                            заказов</a>
                    },
                    {
                        key: 'menu-functions-reports-orders-register-orders-register-canceled',
                        label: <a data-button-id='menu-functions-reports-orders-register-orders-register-canceled'>Реестр
                            отмененных заказов</a>
                    }
                ]
            },
            {
                key: 'menu-functions-reports-financial-report',
                label: <a data-button-id='menu-functions-reports-financial-report'>Финансовый отчет</a>
            },
            {
                key: 'menu-functions-reports-money-movement',
                label: <a data-button-id='menu-functions-reports-money-movement'>Перемещение ДС</a>
            },
            {
                key: 'menu-functions-reports-courier-salary',
                label: <a data-button-id='menu-functions-reports-courier-salary'>Зарплата курьеров за день</a>
            },
            {
                key: 'menu-functions-reports-change',
                label: <a data-button-id='menu-functions-reports-change'>Размены</a>
            },

        ]
    }
]


const _FunctionsButton = () => {
    const [size, setSize] = useState('large');
    return (
        <>
            <Dropdown
                menu={{
                    items,
                }}
                placement="bottomLeft"
            >
                <Button icon={<SettingOutlined/>} size={size}>
                    Функции
                </Button>
            </Dropdown>
        </>
    )
}

export default _FunctionsButton
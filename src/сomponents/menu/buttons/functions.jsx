import {Button, Dropdown} from 'antd';
import React, {useState} from 'react';
import {SettingOutlined} from "@ant-design/icons";

const items = [
    {
        key: 'menu-functions-working-shift',
        label: 'Рабочая смена',
        children: [
            {
                key: 'menu-functions-working-shift-select-administrator',
                label: <a data-button-id='menu-functions-working-shift-select-administrator'>Выбрать администратора</a>
            },
            {
                key: 'menu-functions-working-shift-open-shift',
                label: <a data-button-id='menu-functions-working-shift-open-shift'>Открыть смену</a>
            },
            {
                key: 'menu-functions-working-shift-financial-report',
                label: <a data-button-id='menu-functions-working-shift-financial-report'>Финансовый отчет</a>
            },
            {
                key: 'menu-functions-working-shift-x-report',
                label: <a data-button-id='menu-functions-working-shift-x-report'>Отчет без гашения</a>
            },
            {
                key: 'menu-functions-working-shift-z-report',
                label: <a data-button-id='menu-functions-working-shift-z-report'>Отчет с гашением</a>
            },
            {
                key: 'menu-functions-working-shift-orders-register',
                label: 'Реестр заказов',
                children: [
                    {
                        key: 'menu-functions-working-shift-orders-register-orders-register',
                        label: <a data-button-id='menu-functions-working-shift-orders-register-orders-register'>Реестр
                            заказов</a>
                    },
                    {
                        key: 'menu-functions-working-shift-orders-register-orders-register-canceled',
                        label: <a data-button-id='menu-functions-working-shift-orders-register-orders-register-canceled'>Реестр
                            отмененных заказов</a>
                    }
                ]
            }

        ]
    },
    {
        key: 'menu-functions-cash',
        label: 'Касса',
        children: [
            {
                key: 'menu-functions-cash-cash-deposit',
                label: <a data-button-id='menu-functions-working-shift-select-administrator'>Внесение наличных</a>
            },
            {
                key: 'menu-functions-cash-cash-withdrawal',
                label: <a data-button-id='menu-functions-cash-cash-withdrawal'>Изъятие наличных</a>
            },
            {
                key: 'menu-functions-cash-money-movement',
                label: <a data-button-id='menu-functions-cash-money-movement'>Перемещение ДС</a>
            },
            {
                key: 'menu-functions-cash-banking-terminal-report',
                label: <a data-button-id='menu-functions-cash-banking-terminal-report'>Отчет по банковскому терминалу</a>
            },
            {
                key: 'menu-functions-cash-banking-terminal-summary-receipt',
                label: <a data-button-id='menu-functions-cash-banking-terminal-summary-receipt'>Сводный чек по банковскому терминалу</a>
            },
            {
                key: 'menu-functions-cash-carrying-out-without-fr',
                label: <a data-button-id='menu-functions-cash-carrying-out-without-fr'>Проведение заказов без фискального аппарата</a>
            },
            {
                key: 'menu-functions-cash-special-packages',
                label: <a data-button-id='menu-functions-cash-special-packages'>Спецпакеты</a>
            },
            {
                key: 'menu-functions-cash-change-report',
                label: <a data-button-id='menu-functions-cash-change-report'>Отчет по разменам</a>
            },


        ]
    },
    {
        key: 'menu-functions-staff',
        label: 'Сотрудники',
        children: [
            {
                key: 'menu-functions-staff-employee-schedule',
                label: <a data-button-id='menu-functions-working-shift-select-administrator'>График сотрудников</a>
            },
            {
                key: 'menu-functions-staff-employee-schedule-report',
                label: <a data-button-id='menu-functions-cash-cash-withdrawal'>Отчет о графике сотрудников</a>
            },
            {
                key: 'menu-functions-staff-ordering-workwear',
                label: <a data-button-id='menu-functions-staff-ordering-workwear'>Заказ спецодежды</a>
            },
            {
                key: 'menu-functions-staff-receiving-funds',
                label: <a data-button-id='menu-functions-staff-receiving-funds'>Получение денежных средств</a>
            },
            {
                key: 'menu-functions-staff-payment-of-wages',
                label: <a data-button-id='menu-functions-staff-payment-of-wages'>Выплата заработной платы</a>
            },
            {
                key: 'menu-functions-staff-fine',
                label: <a data-button-id='menu-functions-staff-fine'>Оштрафовать</a>
            },
            {
                key: 'menu-functions-staff-motivation',
                label: <a data-button-id='menu-functions-staff-motivation'>Мотивация</a>
            },
            {
                key: 'menu-functions-staff-printing-of-statements',
                label: <a data-button-id='menu-functions-staff-printing-of-statements'>Печать ведомостей</a>
            },
        ]
    },
    {
        key: 'menu-functions-products',
        label: 'Продукты',
        children: [
            {
                key: 'menu-functions-products-product-order',
                label: 'Заказ товара',
                children: [
                    {
                        key: 'menu-functions-products-product-order-order',
                        label: <a data-button-id='menu-functions-products-product-order-order'>Заказ товара</a>
                    },
                    {
                        key: 'menu-functions-products-product-order-claims',
                        label: <a data-button-id='menu-functions-products-product-order-claims'>Претензии заказа товара</a>
                    },
                    {
                        key: 'menu-functions-products-product-order-report',
                        label: <a data-button-id='menu-functions-products-product-order-report'>Отчет по заказу товара</a>
                    }
                ]
            },
            {
                key: 'menu-functions-products-inventory',
                label: <a data-button-id='menu-functions-products-inventory'>Инвентаризация</a>
            },
            {
                key: 'menu-functions-products-application-for-relocation',
                label: <a data-button-id='menu-functions-products-application-for-relocation'>Заявка на перемещение</a>
            },
            {
                key: 'menu-functions-products-moving',
                label: <a data-button-id='menu-functions-products-moving'>Перемещение</a>
            },
            {
                key: 'menu-functions-products-stop',
                label: 'Стоп',
                children: [
                    {
                        key: 'menu-functions-products-stop-set-to-stop',
                        label: <a data-button-id='menu-functions-products-stop-set-to-stop'>Установить на стоп</a>
                    },
                    {
                        key: 'menu-functions-products-stop-stop-list-report',
                        label: <a data-button-id='menu-functions-products-stop-stop-list-report'>Отчет стоп лист продукции</a>
                    },
                ]
            },
            {
                key: 'menu-functions-products-incoming-invoices',
                label: <a data-button-id='menu-functions-products-incoming-invoices'>Приходные накладные</a>
            },
            {
                key: 'menu-functions-products-write-downs',
                label: 'Списание',
                children: [
                    {
                        key: 'menu-functions-products-write-downs-acts',
                        label: <a data-button-id='menu-functions-products-write-downs-acts'>Акты списания</a>
                    },
                    {
                        key: 'menu-functions-products-write-downs-report',
                        label: <a data-button-id='menu-functions-products-write-downs-report'>Отчет по списаниям</a>
                    },
                ]
            },
            {
                key: 'menu-functions-products-alcohol',
                label: 'Алкоголь',
                children: [
                    {
                        key: 'menu-functions-products-alcohol-sale',
                        label: <a data-button-id='menu-functions-products-alcohol-sale'>Продажа алкоголя</a>
                    },
                    {
                        key: 'menu-functions-products-alcohol-kegs-opening',
                        label: <a data-button-id='menu-functions-products-alcohol-kegs-opening'>Вскрытие кег</a>
                    },
                    {
                        key: 'menu-functions-products-alcohol-opening',
                        label: <a data-button-id='menu-functions-products-alcohol-opening'>Вскрытие алкоголя</a>
                    },
                    {
                        key: 'menu-functions-products-alcohol-accounting',
                        label: <a data-button-id='menu-functions-products-alcohol-accounting'>Учет алкоголя</a>
                    },
                ]
            },

        ]
    },
    {
        key: 'menu-functions-indicators',
        label: 'Показатели',
        children: [
            {
                key: 'menu-functions-indicators-quality-control',
                label: <a data-button-id='menu-functions-indicators-quality-control'>Контроль качества</a>
            },
            {
                key: 'menu-functions-indicators-performance-report',
                label: <a data-button-id='menu-functions-indicators-performance-report'>Отчет по производительности</a>
            },
            {
                key: 'menu-functions-indicators-ato-report',
                label: <a data-button-id='menu-functions-indicators-ato-report'>Отчет по АТО</a>
            },
            {
                key: 'menu-functions-indicators-sous-chef-tableau',
                label: <a data-button-id='menu-functions-indicators-sous-chef-tableau'>Табло су-шефа</a>
            },
        ]
    },
    {
        key: 'menu-functions-equipment',
        label: 'Оборудование',
        children: [
            {
                key: 'menu-functions-equipment-install-mkkt54-fx-component',
                label: <a data-button-id='menu-functions-equipment-install-mkkt54-fx-component'>Установить компоненту МККТ54 ФЗ</a>
            },
            {
                key: 'menu-functions-equipment-install-acquiring-component',
                label: <a data-button-id='menu-functions-equipment-install-acquiring-component'>Установить компоненту для эквайринга</a>
            },
            {
                key: 'menu-functions-equipment-install-component-connected-hardware',
                label: <a data-button-id='menu-functions-equipment-install-component-connected-hardware'>Установить компоненту подключаемого оборудования</a>
            },
            {
                key: 'menu-functions-equipment-test',
                label: <a data-button-id='menu-functions-equipment-test'>Тест оборудования</a>
            },
            {
                key: 'menu-functions-equipment-repair',
                label: <a data-button-id='menu-functions-equipment-repair'>Ремонт оборудования</a>
            },
            {
                key: 'menu-functions-equipment-request-repairs',
                label: <a data-button-id='menu-functions-equipment-request-repairs'>Заявка на ремонт</a>
            },
            {
                key: 'menu-functions-equipment-ordering',
                label: <a data-button-id='menu-functions-equipment-ordering'>Заказ оборудования</a>
            },
        ]
    },
    {
        key: 'menu-functions-delivery',
        label: 'Доставка',
        children: [
            {
                key: 'menu-functions-delivery-report',
                label: <a data-button-id='menu-functions-delivery-report'>Отчет по доставке</a>
            },
            {
                key: 'menu-functions-delivery-changing-courier-password',
                label: <a data-button-id='menu-functions-delivery-changing-courier-password'>Смена пароля курьера</a>
            },
        ]
    },



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
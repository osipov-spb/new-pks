// noinspection JSValidateTypes,SpellCheckingInspection

import React, {useState} from 'react';
import {Button, Collapse, Drawer, List, Menu, Space, Typography} from 'antd';
import {
    AlertOutlined,
    AuditOutlined,
    BarChartOutlined,
    BarcodeOutlined,
    BugOutlined,
    BuildOutlined,
    CarOutlined,
    CheckCircleOutlined,
    ContainerOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    DesktopOutlined,
    DollarOutlined,
    FieldTimeOutlined,
    FileAddOutlined,
    FileDoneOutlined,
    FileExcelOutlined,
    FilePptOutlined,
    FileProtectOutlined,
    FileSearchOutlined,
    FileSyncOutlined,
    FileTextOutlined,
    FormOutlined,
    FundOutlined,
    LaptopOutlined,
    LineChartOutlined,
    LockOutlined,
    MenuOutlined,
    MinusSquareOutlined,
    PlusSquareOutlined,
    PoweroffOutlined,
    ReconciliationOutlined,
    SafetyOutlined,
    ScheduleOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    SkinOutlined,
    StopOutlined,
    SwapOutlined,
    TeamOutlined,
    ToolOutlined,
    UserOutlined,
    WalletOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;
const { Text } = Typography;


const menuSections = [
    {
        key: 'working-shift',
        label: 'Рабочая смена',
        icon: <ScheduleOutlined />,
        items: [
            {
                label: 'Выбрать администратора',
                icon: <UserOutlined />,
                id: 'menu-functions-working-shift-select-administrator'
            },
            {
                label: 'Открыть смену',
                icon: <FileAddOutlined />,
                id: 'menu-functions-working-shift-open-shift'
            },
            {
                label: 'Финансовый отчет',
                icon: <FundOutlined />,
                id: 'menu-functions-working-shift-financial-report'
            },
            {
                label: 'Отчет без гашения',
                icon: <FileTextOutlined />,
                id: 'menu-functions-working-shift-x-report'
            },
            {
                label: 'Отчет с гашением',
                icon: <FileDoneOutlined />,
                id: 'menu-functions-working-shift-z-report'
            },
            {
                key: 'orders-register',
                label: 'Реестр заказов',
                icon: <ContainerOutlined />,
                items: [
                    {
                        label: 'Реестр заказов',
                        icon: <ContainerOutlined />,
                        id: 'menu-functions-working-shift-orders-register-orders-register'
                    },
                    {
                        label: 'Реестр отмененных заказов',
                        icon: <FileExcelOutlined />,
                        id: 'menu-functions-working-shift-orders-register-orders-register-canceled'
                    }
                ]
            }
        ]
    },
    {
        key: 'cash',
        label: 'Касса',
        icon: <DollarOutlined />,
        items: [
            {
                label: 'Внесение наличных',
                icon: <PlusSquareOutlined />,
                id: 'menu-functions-cash-cash-deposit'
            },
            {
                label: 'Изъятие наличных',
                icon: <MinusSquareOutlined />,
                id: 'menu-functions-cash-cash-withdrawal'
            },
            {
                label: 'Перемещение ДС',
                icon: <SwapOutlined />,
                id: 'menu-functions-cash-money-movement'
            },
            {
                label: 'Отчет по банковскому терминалу',
                icon: <CreditCardOutlined />,
                id: 'menu-functions-cash-banking-terminal-report'
            },
            {
                label: 'Сводный чек по банковскому терминалу',
                icon: <FileTextOutlined />,
                id: 'menu-functions-cash-banking-terminal-summary-receipt'
            },
            {
                label: 'Проведение заказов без фискального аппарата',
                icon: <FileSyncOutlined />,
                id: 'menu-functions-cash-carrying-out-without-fr'
            },
            {
                label: 'Спецпакеты',
                icon: <SafetyOutlined />,
                id: 'menu-functions-cash-special-packages'
            },
            {
                label: 'Отчет по разменам',
                icon: <FileSearchOutlined />,
                id: 'menu-functions-cash-change-report'
            }
        ]
    },
    {
        key: 'staff',
        label: 'Сотрудники',
        icon: <TeamOutlined />,
        items: [
            {
                label: 'График сотрудников',
                icon: <ScheduleOutlined />,
                id: 'menu-functions-staff-employee-schedule'
            },
            {
                label: 'Отчет о графике сотрудников',
                icon: <FileProtectOutlined />,
                id: 'menu-functions-staff-employee-schedule-report'
            },
            {
                label: 'Заказ спецодежды',
                icon: <SkinOutlined />,
                id: 'menu-functions-staff-ordering-workwear'
            },
            {
                label: 'Получение денежных средств',
                icon: <WalletOutlined />,
                id: 'menu-functions-staff-receiving-funds'
            },
            {
                label: 'Выплата заработной платы',
                icon: <FormOutlined />,
                id: 'menu-functions-staff-payment-of-wages'
            },
            {
                label: 'Оштрафовать',
                icon: <StopOutlined />,
                id: 'menu-functions-staff-fine'
            },
            {
                label: 'Мотивация',
                icon: <CheckCircleOutlined />,
                id: 'menu-functions-staff-motivation'
            },
            {
                label: 'Печать ведомостей',
                icon: <FilePptOutlined />,
                id: 'menu-functions-staff-printing-of-statements'
            },
            {
                label: 'Замена карт учета времени',
                icon: <FieldTimeOutlined />,
                id: 'menu-functions-staff-replace-time-tracking-card'
            }
        ]
    },
    {
        key: 'products',
        label: 'Продукты',
        icon: <ShoppingOutlined />,
        items: [
            {
                label: 'Инвентаризация',
                icon: <AuditOutlined />,
                id: 'menu-functions-products-inventory'
            },
            {
                label: 'Заявка на перемещение',
                icon: <FileSyncOutlined />,
                id: 'menu-functions-products-application-for-relocation'
            },
            {
                label: 'Перемещение',
                icon: <SwapOutlined />,
                id: 'menu-functions-products-moving'
            },
            {
                label: 'Приходные накладные',
                icon: <BarcodeOutlined />,
                id: 'menu-functions-products-incoming-invoices'
            },
            {
                key: 'product-order',
                label: 'Заказ товара',
                icon: <ShoppingCartOutlined />,
                items: [
                    {
                        label: 'Заказ товара',
                        icon: <ShoppingCartOutlined />,
                        id: 'menu-functions-products-product-order-order'
                    },
                    {
                        label: 'Претензии заказа товара',
                        icon: <AlertOutlined />,
                        id: 'menu-functions-products-product-order-claims'
                    },
                    {
                        label: 'Отчет по заказу товара',
                        icon: <BarChartOutlined />,
                        id: 'menu-functions-products-product-order-report'
                    }
                ]
            },
            {
                key: 'stop',
                label: 'Стоп',
                icon: <StopOutlined />,
                items: [
                    {
                        label: 'Установить на стоп',
                        icon: <StopOutlined />,
                        id: 'menu-functions-products-stop-set-to-stop'
                    },
                    {
                        label: 'Отчет стоп лист продукции',
                        icon: <FileTextOutlined />,
                        id: 'menu-functions-products-stop-stop-list-report'
                    }
                ]
            },
            {
                key: 'write-downs',
                label: 'Списание',
                icon: <ReconciliationOutlined />,
                items: [
                    {
                        label: 'Акты списания',
                        icon: <ReconciliationOutlined />,
                        id: 'menu-functions-products-write-downs-acts'
                    },
                    {
                        label: 'Отчет по списаниям',
                        icon: <FileSearchOutlined />,
                        id: 'menu-functions-products-write-downs-report'
                    }
                ]
            },
            {
                key: 'alcohol',
                label: 'Алкоголь',
                icon: <BarcodeOutlined />,
                items: [
                    {
                        label: 'Продажа алкоголя',
                        icon: <ShoppingOutlined />,
                        id: 'menu-functions-products-alcohol-sale'
                    },
                    {
                        label: 'Вскрытие кег',
                        icon: <ToolOutlined />,
                        id: 'menu-functions-products-alcohol-kegs-opening'
                    },
                    {
                        label: 'Вскрытие алкоголя',
                        icon: <ToolOutlined />,
                        id: 'menu-functions-products-alcohol-opening'
                    },
                    {
                        label: 'Учет алкоголя',
                        icon: <AuditOutlined />,
                        id: 'menu-functions-products-alcohol-accounting'
                    }
                ]
            }
        ]
    },
    {
        key: 'indicators',
        label: 'Показатели',
        icon: <LineChartOutlined />,
        items: [
            {
                label: 'Контроль качества',
                icon: <DashboardOutlined />,
                id: 'menu-functions-indicators-quality-control'
            },
            {
                label: 'Отчет по производительности',
                icon: <BarChartOutlined />,
                id: 'menu-functions-indicators-performance-report'
            },
            {
                label: 'Отчет по АТО',
                icon: <FileSearchOutlined />,
                id: 'menu-functions-indicators-ato-report'
            },
            {
                label: 'Табло су-шефа',
                icon: <DashboardOutlined />,
                id: 'menu-functions-indicators-sous-chef-tableau'
            }
        ]
    },
    {
        key: 'equipment',
        label: 'Оборудование',
        icon: <LaptopOutlined />,
        items: [
            {
                label: 'Установить компоненту МККТ54 ФЗ',
                icon: <BuildOutlined />,
                id: 'menu-functions-equipment-install-mkkt54-fx-component'
            },
            {
                label: 'Установить компоненту для эквайринга',
                icon: <CreditCardOutlined />,
                id: 'menu-functions-equipment-install-acquiring-component'
            },
            {
                label: 'Установить компоненту подключаемого оборудования',
                icon: <BuildOutlined />,
                id: 'menu-functions-equipment-install-component-connected-hardware'
            },
            {
                label: 'Тест оборудования',
                icon: <BugOutlined />,
                id: 'menu-functions-equipment-test'
            },
            {
                label: 'Ремонт оборудования',
                icon: <ToolOutlined />,
                id: 'menu-functions-equipment-repair'
            },
            {
                label: 'Заявка на ремонт',
                icon: <FormOutlined />,
                id: 'menu-functions-equipment-request-repairs'
            },
            {
                label: 'Заказ оборудования',
                icon: <ShoppingCartOutlined />,
                id: 'menu-functions-equipment-ordering'
            }
        ]
    },
    {
        key: 'delivery',
        label: 'Доставка',
        icon: <CarOutlined />,
        items: [
            {
                label: 'Отчет по доставке',
                icon: <FileTextOutlined />,
                id: 'menu-functions-delivery-report'
            },
            {
                label: 'Смена пароля курьера',
                icon: <LockOutlined />,
                id: 'menu-functions-delivery-changing-courier-password'
            }
        ]
    }
];


const SidebarMenu = () => {
    const [open, setOpen] = useState(false);
    const [activeKeys, setActiveKeys] = useState([]); // Изначально все свернуто

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const renderNestedItems = (items) => {
        return items.map(item => {
            if (item.items) {
                return (
                    <Panel
                        key={item.key}
                        header={
                            <Space>
                                {item.icon}
                                <Text>{item.label}</Text>
                            </Space>
                        }
                        style={{ borderBottom: '1px solid #f0f0f0', paddingLeft: '0px' }}
                    >
                        <List
                            dataSource={item.items}
                            renderItem={subItem => (
                                <List.Item
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        borderBottom: 'none'
                                    }}
                                >
                                    <Space>
                                        {subItem.icon}
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a
                                            href="#"
                                            data-button-id={subItem.id}
                                            style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                                        >
                                            {subItem.label}
                                        </a>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Panel>
                );
            }
            return (
                <List.Item
                    key={item.id}
                    style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: 'none'
                    }}
                >
                    <Space>
                        {item.icon}
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a
                            href="#"
                            data-button-id={item.id}
                            style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                        >
                            {item.label}
                        </a>
                    </Space>
                </List.Item>
            );
        });
    };

    return (
        <>
            <Button
                size='large'
                icon={<MenuOutlined />}
                onClick={showDrawer}
                style={{
                    borderRadius: '8px',
                    border: '1px solid #d9d9d9'
                }}
            >
                Меню
            </Button>

            <Drawer
                placement="left"
                onClose={closeDrawer}
                open={open}  // Changed from visible to open
                width={450}
                bodyStyle={{
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
                headerStyle={{padding: '16px'}}
                closable={true}
            >
                <div style={{flex: 1, overflow: 'auto'}}>
                    <Collapse
                        activeKey={activeKeys}
                        onChange={setActiveKeys}
                        bordered={false}
                        expandIconPosition="end"
                        ghost
                    >
                        {menuSections.map(section => (
                            <Panel
                                key={section.key}
                                header={
                                    <Space>
                                        {section.icon}
                                        <Text>{section.label}</Text>
                                    </Space>
                                }
                                style={{borderBottom: '1px solid #f0f0f0'}}
                            >
                                <List
                                    dataSource={section.items}
                                    renderItem={item => {
                                        if (item.items) {
                                            return (
                                                <Collapse
                                                    bordered={false}
                                                    expandIconPosition="end"
                                                    ghost
                                                >
                                                    {renderNestedItems([item])}
                                                </Collapse>
                                            );
                                        }
                                        return (
                                            <List.Item
                                                style={{padding: '12px 16px', cursor: 'pointer'}}
                                            >
                                                <Space>
                                                    {item.icon}
                                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                    <a
                                                        href="#"
                                                        data-button-id={item.id}
                                                        style={{color: 'rgba(0, 0, 0, 0.85)'}}
                                                    >
                                                        {item.label}
                                                    </a>
                                                </Space>
                                            </List.Item>
                                        );
                                    }}
                                />
                            </Panel>
                        ))}
                    </Collapse>
                </div>

                <div style={{
                    borderTop: '1px solid #f0f0f0',
                    padding: '16px',
                    background: '#fff'
                }}>
                    <Menu mode="vertical" selectable={false}>
                        <Menu.Item key="desktop" style={{padding: 0}}>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a
                                href="#"
                                data-button-id="show-desktop"
                                //onClick={(e) => handleAction(e, 'show-desktop')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: 48,
                                    padding: '0 16px',
                                    color: '#1890ff'
                                }}
                            >
                                <DesktopOutlined style={{marginRight: 8}}/>
                                Показать рабочий стол
                            </a>
                        </Menu.Item>
                        <Menu.Item key="shutdown" style={{padding: 0}}>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a
                                href="#"
                                data-button-id="shutdown"
                                //onClick={(e) => handleAction(e, 'shutdown')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: 48,
                                    padding: '0 16px',
                                    color: '#ff4d4f'
                                }}
                            >
                                <PoweroffOutlined style={{marginRight: 8}}/>
                                Завершить работу
                            </a>
                        </Menu.Item>
                    </Menu>
                </div>

            </Drawer>
        </>
    );
};

export default SidebarMenu;
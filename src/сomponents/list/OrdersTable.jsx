// noinspection JSUnusedLocalSymbols,SpellCheckingInspection,JSUnusedGlobalSymbols

import React from 'react';
import {Button, Menu, Popover, Space, Table, Tag, Typography} from 'antd';
import {
    CalendarOutlined,
    CarOutlined,
    CheckCircleOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CreditCardOutlined,
    DeleteOutlined,
    FieldTimeOutlined,
    ForwardOutlined,
    GlobalOutlined,
    HomeOutlined,
    HourglassOutlined,
    Loading3QuartersOutlined,
    NumberOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    UserOutlined,
    WalletOutlined
} from "@ant-design/icons";
import {debounce} from 'lodash';

const { Text } = Typography;

// noinspection JSUnusedLocalSymbols
class OrdersTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            isLoading: false,
            tableHeight: 600,
            statusFilter: ['temporary', 'in_progress'],
            scheduledFilter: false,
            filterDropdownVisible: false,
            selectedFilterKeys: ['temporary', 'in_progress']
        };

        this.updateTableHeight = this.updateTableHeight.bind(this);
        this.handleResize = debounce(this.updateTableHeight, 100);
    }

    handleStatusFilterChange = (selectedFilters) => {
        this.setState({
            statusFilter: selectedFilters,
            selectedFilterKeys: selectedFilters
        });
    }

    // Новая функция для подтверждения фильтров
    confirmStatusFilters = () => {
        this.setState(prevState => ({
            statusFilter: prevState.selectedFilterKeys,
            filterDropdownVisible: false
        }));
    };

    // Функция для сброса фильтров
    resetStatusFilters = () => {
        const defaultFilters = ['temporary', 'in_progress'];
        this.setState({
            selectedFilterKeys: defaultFilters,
            statusFilter: defaultFilters,
            filterDropdownVisible: false
        });
    };

    setFilterDropdownVisible = (visible) => {
        this.setState({ filterDropdownVisible: visible });
    }

    filterOrdersByStatus = (orders) => {
        const { statusFilter } = this.state;

        if (!statusFilter || statusFilter.length === 0 || statusFilter.length === 4) {
            return orders;
        }

        return orders.filter(order => {
            const isDeleted = order.deleted;
            const status = order.orderStatus;

            if (statusFilter.includes('deleted')
                && (isDeleted || status === 'Отказ')
                && (isDeleted || status === '8.Удален')) return true;
            if (isDeleted) return false;

            let matchesFilter = false;

            if (statusFilter.includes('temporary') && status === 'Временной') {
                matchesFilter = true;
            }

            if (statusFilter.includes('in_progress') && [
                '1.Заказан', '2.Кухня', '2,5.Комплектация',
                '3.Ожидает', '4.В пути', '5.Доставлен', '1.1 Ожидание оплаты',
                'Возврат на ТТ', '1.2 Ожидание оплаты на точке клиентом'
            ].includes(status)) {
                matchesFilter = true;
            }

            if (statusFilter.includes('completed') && status === '6.Деньги сдал') {
                matchesFilter = true;
            }

            return matchesFilter;
        });
    }

    componentDidMount() {
        this.setupWindowMethods();
        this.updateTableHeight();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.handleResize.cancel();
    }

    updateTableHeight() {
        const height = window.innerHeight - 165;
        this.setState({ tableHeight: Math.max(height, 300) });
    }

    setupWindowMethods = () => {
        window.list_LoadAllItems = this.loadAllOrders;
        window.setScheduledFilterButtonState = this.setScheduledFilterButtonState;
        window.getCurrentStatusFilters = this.getCurrentStatusFilters;
        window.confirmStatusFilters = this.confirmStatusFilters;
        window.resetStatusFilters = this.resetStatusFilters;
        window.setFilterDropdownVisible = this.setFilterDropdownVisible;
    }

    getCurrentStatusFilters = () => {
        const { filterDropdownVisible, selectedFilterKeys, statusFilter } = this.state;

        return filterDropdownVisible ? JSON.stringify(selectedFilterKeys) : JSON.stringify(statusFilter)
            ;
    }

    loadAllOrders = (ordersJson) => {
        this.setState({ isLoading: true });
        try {
            const orders = typeof ordersJson === 'string' ? JSON.parse(ordersJson) : ordersJson;
            if (!Array.isArray(orders)) {
                console.error('list_LoadAllItems ожидает массив заказов или JSON-строку');
                return;
            }

            const formattedOrders = orders.map(order => ({
                id: order.id || 0,
                orderDate: order.orderDate || '',
                orderNumber: order.orderNumber || '',
                orderStatus: order.orderStatus || '',
                orderPackage: order.orderPackage || '',
                orderPaymentType: order.orderPaymentType || '',
                orderTotal: order.orderTotal || 0,
                orderAddress: order.orderAddress || '',
                orderOnlineID: order.orderOnlineID || '',
                deleted: order.deleted || false,
                paid: order.paid || false,
                clientName : order.clientName || '',
                clientPhone : order.clientPhone || ''
            }));


            this.setState({ dataSource: formattedOrders, isLoading: false });
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
            this.setState({ isLoading: false });
        }
    }

    setScheduledFilterButtonState = (isPrimary) => {
        this.setState({ scheduledFilter: isPrimary });
    }

    formatOrderDate = (dateString) => {
        if (!dateString) return '';

        if (typeof dateString === 'string' && dateString.match(/^\d{2}\.\d{2} \d{2}:\d{2}$/)) {
            return dateString;
        }

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;

            const day = date.getUTCDate().toString().padStart(2, '0');
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');

            return `${day}.${month} ${hours}:${minutes}`;
        } catch (e) {
            console.error('Ошибка форматирования даты:', e);
            return dateString;
        }
    }

    getStatusTagConfig = (orderStatus) => {
        const statusMap = {
            'Временной': { color: '#FFEED8', textColor: '#000000', text: 'Временной', statusIcon: <ClockCircleOutlined style={{ color: '#d48806' }}/>},
            '1.Заказан': { color: '#F4E1FB', textColor: '#000000', text: 'Заказан', statusIcon: <HourglassOutlined style={{ color: '#c41d7f' }}/> },
            '2.Кухня': { color: '#FBDBD7', textColor: '#000000', text: 'Кухня', statusIcon: <HourglassOutlined style={{ color: '#d4380d' }}/>},
            '2,5.Комплектация': { color: '#FFF0EF', textColor: '#000000', text: 'Комплектация', statusIcon: <ShoppingOutlined style={{ color: '#fa541c' }}/>},
            '3.Ожидает': { color: '#DBF4FB', textColor: '#000000', text: 'Ожидает', statusIcon: <HourglassOutlined style={{ color: '#096dd9' }}/>},
            '4.В пути': { color: '#FFFAC5', textColor: '#000000', text: 'В пути', statusIcon: <CarOutlined style={{ color: '#d48806' }}/>},
            '5.Доставлен': { color: '#EEFCF1', textColor: '#000000', text: 'Доставлен', statusIcon: <CheckCircleOutlined style={{ color: '#52c41a' }}/>},
            '6.Деньги сдал': { color: '#D2F0D3', textColor: '#000000', text: 'Деньги сдал', statusIcon: <CheckOutlined style={{ color: '#52c41a' }}/>},
            '7.На удаление': { color: '#F3E1D0', textColor: '#000000', text: 'На удаление', statusIcon: <DeleteOutlined style={{ color: '#f5222d' }}/>},
            '8.Удален': { color: '#F3E1D0', textColor: '#000000', text: 'Удален', statusIcon: <DeleteOutlined style={{ color: '#ff4d4f' }}/>},
            'Отказ': { color: '#F3E1D0', textColor: '#000000', text: 'Отказ', statusIcon: <CloseCircleOutlined style={{ color: '#f5222d' }}/>},
            '1.1 Ожидание оплаты': { color: '#e6fffb', textColor: '#000000', text: 'Ожидание оплаты', statusIcon: <HourglassOutlined style={{ color: '#08979c' }}/>},
            'Возврат на ТТ': { color: '#F3E1D0', textColor: '#000000', text: 'Возврат на точку', statusIcon: <CarOutlined style={{ color: '#d48806' }}/>},
            '1.2 Ожидание оплаты на точке клиентом': { color: '#e6fffb', textColor: '#000000', text: 'Ожидание оплаты на точке', statusIcon: <HourglassOutlined style={{ color: '#08979c' }}/>},
        };
        return statusMap[orderStatus] || { color: 'geekblue', textColor: 'black', text: `●${orderStatus}` };
    }

    cleanStatusText = (status) => {
        if (!status) return '';
        let cleaned = status.replace(/^[\d,]+\.?\s*/, '');
        return cleaned.replace('ТТ', 'торговую точку');
    };

    renderCellContent = (content, record) => {
        if (record.deleted) {
            return (
                <div style={{
                    textDecoration: 'line-through',
                    opacity: 0.7,
                    color: '#FF4D4F',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '13px'
                }}>
                    {content}
                </div>
            );
        }
        return <div style={{ width: '100%', textAlign: 'center', fontSize: '13px' }}>{content}</div>;
    }

    renderNumberCell = (_, { orderNumber, id, deleted, paid }) => {
        return (
            <Button
                block
                href='#'
                data-button-id={`open-order-${id}`}
                style={{
                    background: deleted ? '#fff2f0' : paid ? '#f6ffed' : 'transparent',
                    borderColor: deleted ? '#ffccc7' : paid ? '#b7eb8f' : '#d9d9d9',
                    height: '100%',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    fontWeight: paid ? 600 : 'normal',
                    borderWidth: '1.5px',
                    transition: 'all 0.2s ease'
                }}
            >
                <Space size={4}>
                    {deleted && <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 12 }} />}
                    {paid && !deleted && <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 12 }} />}
                    <span
                        style={{
                            textDecoration: deleted ? 'line-through' : 'none',
                            color: deleted ? '#ff4d4f' : paid ? '#389e0d' : '#262626',
                            opacity: deleted ? 0.7 : 1,
                            fontSize: '13px'
                        }}
                    >
                        {orderNumber.replace(/\s+/g, '').slice(-4)}
                    </span>
                </Space>
            </Button>
        );
    }

    renderStatusTag = (orderStatus, record) => {
        const { color, textColor, text, statusIcon } = this.getStatusTagConfig(orderStatus);
        return (
            <div
                style={{
                    background: color,
                    width: '100%',
                    minHeight: '32px',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    padding: '6px 8px',
                    textDecoration: record.deleted ? 'line-through' : 'none',
                    opacity: record.deleted ? 0.7 : 1,
                    border: `1px solid ${color}20`,
                    fontSize: '12px'
                }}
            >
                <div style={{
                    color: record.deleted ? '#FF4D4F' : textColor,
                    width: '100%',
                    textAlign: 'center',
                    fontWeight: 500
                }}>
                    <Space size='small'>
                        {statusIcon}
                        {this.cleanStatusText(text)}
                    </Space>
                </div>
            </div>
        );
    }

    getColumns = () => {
        const { scheduledFilter, filterDropdownVisible } = this.state;

        return [
            {
                title: () => {
                    return  (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#262626'
                        }}>
                            <Space size='small'>
                                <CalendarOutlined style={{ color: '#1890ff' }}/>
                                <span>Дата</span>
                            </Space>
                        </div>
                    )
                },
                dataIndex: 'orderDate',
                key: 'orderDate',
                width: 100,
                sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
                render: (dateString, record) => this.renderCellContent(this.formatOrderDate(dateString), record)
            },
            {
                title: () => {
                    return  (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#262626'
                        }}>
                            <Space size='small'>
                                <NumberOutlined style={{ color: '#1890ff' }}/>
                                <span>Номер</span>
                            </Space>
                        </div>
                    )
                },
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 100,
                sorter: (a, b) => a.orderNumber.localeCompare(b.orderNumber),
                render: this.renderNumberCell
            },
            {
                title: () => (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#262626'
                    }}>
                        <div>
                            <Space size='small'>
                                <ForwardOutlined style={{ color: '#1890ff' }}/>
                                <span>Статус</span>
                            </Space>
                        </div>
                        <Button
                            href="#"
                            data-button-id="menu-sheduled-orders"
                            size='small'
                            icon={<FieldTimeOutlined />}
                            type={scheduledFilter ? 'primary' : 'default'}
                            style={{
                                borderRadius: '6px',
                                fontSize: '12px',
                                height: '24px',
                                padding: '0 8px'
                            }}
                        >
                            Временные
                        </Button>
                    </div>
                ),
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                width: 210,
                filters: [
                    { text: 'Текущие', value: 'in_progress' },
                    { text: 'Временные', value: 'temporary' },
                    { text: 'Выполненные', value: 'completed' },
                    { text: 'Удаленные', value: 'deleted' },
                ],
                filteredValue: this.state.statusFilter,
                onFilter: () => true,
                filterDropdownVisible: filterDropdownVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setFilterDropdownVisible(visible);
                    if (!visible) {
                        this.setState({ selectedFilterKeys: this.state.statusFilter });
                    }
                },
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                    const currentSelectedKeys = selectedKeys || this.state.selectedFilterKeys;

                    return (
                        <div style={{ padding: 8, borderRadius: '8px' }}>
                            <Menu
                                multiple
                                style={{ border: 0, borderRadius: '6px' }}
                                selectedKeys={currentSelectedKeys}
                                onSelect={({ selectedKeys: newSelectedKeys }) => {
                                    setSelectedKeys(newSelectedKeys);
                                    this.setState({ selectedFilterKeys: newSelectedKeys });
                                }}
                                onDeselect={({ selectedKeys: newSelectedKeys }) => {
                                    setSelectedKeys(newSelectedKeys);
                                    this.setState({ selectedFilterKeys: newSelectedKeys });
                                }}
                            >
                                <Menu.Item key="in_progress" style={{ borderRadius: '4px', margin: '2px 0' }}>Текущие</Menu.Item>
                                <Menu.Item key="temporary" style={{ borderRadius: '4px', margin: '2px 0' }}>Временные</Menu.Item>
                                <Menu.Item key="completed" style={{ borderRadius: '4px', margin: '2px 0' }}>Выполненные</Menu.Item>
                                <Menu.Item key="deleted" style={{ borderRadius: '4px', margin: '2px 0' }}>Удаленные</Menu.Item>
                            </Menu>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, gap: '6px' }}>
                                <button
                                    type="button"
                                    data-1c-button-id="filter-reset"
                                    onClick={(e) => {
                                        const defaultFilters = ['temporary', 'in_progress'];
                                        setSelectedKeys(defaultFilters);
                                        this.setState({
                                            selectedFilterKeys: defaultFilters,
                                            statusFilter: defaultFilters,
                                            filterDropdownVisible: false
                                        });

                                        const temp = document.createElement('a');
                                        temp.href = '#';
                                        temp.setAttribute('data-button-id', 'filter-reset');
                                        temp.style.display = 'none';
                                        document.body.appendChild(temp);
                                        temp.click();
                                        document.body.removeChild(temp);
                                    }}
                                    style={{
                                        padding: '4px 8px',
                                        fontSize: '12px',
                                        borderRadius: '6px',
                                        height: '28px',
                                        background: 'transparent',
                                        border: '1px solid #d9d9d9',
                                        cursor: 'pointer',
                                        flex: 1,
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                                >
                                    Сбросить
                                </button>

                                <button
                                    type="button"
                                    data-1c-button-id="filter-completed"
                                    onClick={(e) => {
                                        confirm();
                                        this.setState({
                                            statusFilter: currentSelectedKeys,
                                            filterDropdownVisible: false
                                        });

                                        const temp = document.createElement('a');
                                        temp.href = '#';
                                        temp.setAttribute('data-button-id', 'filter-completed');
                                        temp.style.display = 'none';
                                        document.body.appendChild(temp);
                                        temp.click();
                                        document.body.removeChild(temp);
                                    }}
                                    style={{
                                        padding: '4px 12px',
                                        fontSize: '12px',
                                        borderRadius: '6px',
                                        height: '28px',
                                        background: '#1890ff',
                                        color: 'white',
                                        border: '1px solid #1890ff',
                                        cursor: 'pointer',
                                        flex: 1,
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = '#40a9ff'}
                                    onMouseOut={(e) => e.target.style.background = '#1890ff'}
                                >
                                    Применить
                                </button>
                            </div>
                        </div>
                    );
                },
                render: this.renderStatusTag
            },
            {
                title: () => {
                    return  (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#262626'
                        }}>
                            <Space size='small'>
                                <ShoppingCartOutlined style={{ color: '#1890ff' }}/>
                                <span>Упаковка</span>
                            </Space>
                        </div>
                    )
                },
                dataIndex: 'orderPackage',
                key: 'orderPackage',
                width: 110,
                sorter: (a, b) => a.orderPackage.localeCompare(b.orderPackage),
                render: (text, record) => this.renderCellContent(text, record)
            },
            {
                title: () => {
                    return  (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#262626'
                        }}>
                            <Space size='small'>
                                <UserOutlined style={{ color: '#1890ff' }}/>
                                <span>Клиент</span>
                            </Space>
                        </div>
                    )
                },
                dataIndex: 'clientPhone',
                key: 'clientPhone',
                width: 130,
                render: (text, record) => (
                    <Popover
                        content={
                            <div style={{ padding: '8px', fontSize: '12px' }}>
                                {record.clientName || 'Имя не указано'}
                            </div>
                        }
                        title="Имя клиента"
                        trigger="hover"
                    >
                        {this.renderCellContent(text, record)}
                    </Popover>
                )
            },
            {
                title: () => {
                    return  (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#262626'
                        }}>
                            <Space size='small'>
                                <CheckOutlined style={{ color: '#1890ff' }}/>
                                <span>Сумма</span>
                            </Space>
                        </div>
                    )
                },
                dataIndex: 'orderTotal',
                key: 'orderTotal',
                width: 100,
                sorter: (a, b) => a.orderTotal - b.orderTotal,
                render: (text, record) => this.renderCellContent(`${text} ₽`, record)
            },
            {
                title: 'Адрес',
                dataIndex: 'orderAddress',
                key: 'orderAddress',
                hidden: true,
                width: 250,
                sorter: (a, b) => a.orderAddress.localeCompare(b.orderAddress),
                render: (text, record) => (
                    <Text style={{ fontSize: '12px' }}>
                        {this.renderCellContent(text?.substring(0, 27), record)}
                    </Text>
                )
            },
            {
                title: '',
                dataIndex: 'tags',
                key: 'tags',
                width: 90,
                render: (_, { orderAddress, orderOnlineID, orderPackage, deleted, orderPaymentType }) => (
                    <Space size='small'>
                        {orderPaymentType==='Наличные' && (
                            <Popover content={
                                <div style={{width: 130, padding: '8px', fontSize: '12px'}}>
                                    Наличные
                                </div>
                            } title="Способ оплаты" trigger="click">
                                <WalletOutlined style={{
                                    color: deleted ? '#FF7875' : '#1890ff',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    background: deleted ? '#fff2f0' : '#f0f8ff',
                                    transition: 'all 0.2s ease'
                                }} />
                            </Popover>
                        )}
                        {orderPaymentType==='Безнал' && (
                            <Popover content={
                                <div style={{width: 130, padding: '8px', fontSize: '12px'}}>
                                    Безналичные
                                </div>
                            } title="Способ оплаты" trigger="click">
                                <CreditCardOutlined style={{
                                    color: deleted ? '#FF7875' : '#1890ff',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    background: deleted ? '#fff2f0' : '#f0f8ff',
                                    transition: 'all 0.2s ease'
                                }} />
                            </Popover>
                        )}
                        {orderPackage === 'Доставка' && (
                            <Popover content={
                                <div style={{ width: 130, padding: '8px', fontSize: '12px' }}>
                                    {orderAddress}
                                </div>
                            } title="Адрес доставки" trigger="click">
                                <HomeOutlined style={{
                                    color: deleted ? '#FF7875' : '#1890ff',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    background: deleted ? '#fff2f0' : '#f0f8ff',
                                    transition: 'all 0.2s ease'
                                }} />
                            </Popover>
                        )}
                        {orderOnlineID && (
                            <Popover content={
                                <div style={{ width: 130, padding: '8px', fontSize: '12px' }}>
                                    {orderOnlineID}
                                </div>
                            } title="№ онлайн заказа" trigger="click">
                                <GlobalOutlined style={{
                                    color: deleted ? '#FF7875' : '#1890ff',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    background: deleted ? '#fff2f0' : '#f0f8ff',
                                    transition: 'all 0.2s ease'
                                }} />
                            </Popover>
                        )}
                    </Space>
                )
            },
            {
                title: 'id',
                dataIndex: 'id',
                key: 'id',
                hidden: true
            },
        ].filter(item => !item.hidden);
    }

    render() {
        const { dataSource, isLoading, tableHeight } = this.state;
        const filteredData = this.filterOrdersByStatus(dataSource);

        return (
            <div style={{
                height: `${tableHeight}px`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}>
                <Table
                    size="small"
                    locale={{
                        emptyText: (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '200px',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                <Loading3QuartersOutlined spin style={{ fontSize: 24, color: '#1890ff' }} />
                                <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                                    {isLoading ? 'Загрузка заказов...' : 'Список заказов пока пуст'}
                                </Text>
                            </div>
                        )
                    }}
                    columns={this.getColumns()}
                    dataSource={filteredData}
                    bordered={false}
                    pagination={false}
                    showSorterTooltip={false}
                    scroll={{
                        y: tableHeight - 44,
                        x: 'max-content'
                    }}
                    style={{
                        flex: 1,
                        overflowX: 'auto',
                        width: '100%',
                        tableLayout: 'fixed',
                    }}
                    onChange={(pagination, filters) => {
                        if (filters.orderStatus) {
                            this.handleStatusFilterChange(filters.orderStatus);
                        }
                    }}
                    components={{
                        body: {
                            cell: (props) => <td {...props} style={{
                                ...props.style,
                                padding: 'px 12px',
                                verticalAlign: 'middle',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                borderBottom: '1px solid #f0f0f0',
                                fontSize: '13px',
                                ...(props.record?.deleted ? {
                                    background: '#fffaf0',
                                    borderColor: '#ffe58f'
                                } : {})
                            }} />,
                            row: (props) => <tr {...props}
                                                style={{
                                                    ...props.style,
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                                className={props.record?.deleted ? 'deleted-order-row' : ''}
                            />,
                        },
                    }}
                    rowClassName={(record) => record.deleted ? 'deleted-order-row' : ''}
                />
            </div>
        );
    }
}

export default OrdersTable;
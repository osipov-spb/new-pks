import React from 'react';
import { Space, Table, Tag, Typography, Popover, Button, Dropdown, Menu } from 'antd';
import { FilterOutlined, GlobalOutlined, HomeOutlined, Loading3QuartersOutlined, DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

class OrdersTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            isLoading: false,
            tableHeight: 600,
            statusFilter: ['temporary', 'in_progress'] // Фильтры по умолчанию
        };
    }

    renderStatusFilter = () => {
        const { statusFilter } = this.state;

        const menu = (
            <Menu
                multiple
                selectedKeys={statusFilter}
                onSelect={({ selectedKeys }) => this.handleStatusFilterChange(selectedKeys)}
                onDeselect={({ selectedKeys }) => this.handleStatusFilterChange(selectedKeys)}
                style={{ padding: '8px 0' }}
            >
                <Menu.Item key="temporary" style={{ padding: '12px 16px' }}>
                    Временные
                </Menu.Item>
                <Menu.Item key="in_progress" style={{ padding: '12px 16px' }}>
                    В работе
                </Menu.Item>
                <Menu.Item key="completed" style={{ padding: '12px 16px' }}>
                    Выполненные
                </Menu.Item>
                <Menu.Item key="deleted" style={{ padding: '12px 16px' }}>
                    Удаленные
                </Menu.Item>
            </Menu>
        );

        return (
            <Dropdown
                overlay={menu}
                trigger={['click']}
                overlayStyle={{ minWidth: '200px' }}
            >
                <Button
                    size="large"
                    icon={<FilterOutlined />}
                    style={{
                        height: '40px',
                        padding: '0 16px',
                        fontSize: '16px',
                        marginRight: '8px'
                    }}
                >
                    Фильтр
                </Button>
            </Dropdown>
        );
    }

    handleStatusFilterChange = (selectedFilters) => {
        this.setState({ statusFilter: selectedFilters });
    }

    filterOrdersByStatus = (orders) => {
        const { statusFilter } = this.state;

        if (!statusFilter || statusFilter.length === 0) {
            return orders;
        }

        return orders.filter(order => {
            const isDeleted = order.deleted;
            const status = order.orderStatus;

            // Если выбран фильтр удаленных и заказ удален - показываем
            if (statusFilter.includes('deleted') && isDeleted) {
                return true;
            }

            // Если заказ удален, но фильтр удаленных не выбран - не показываем
            if (isDeleted && !statusFilter.includes('deleted')) {
                return false;
            }

            // Проверяем остальные фильтры для неудаленных заказов
            let matchesFilter = false;

            if (statusFilter.includes('temporary') && status === 'Временной') {
                matchesFilter = true;
            }

            if (statusFilter.includes('in_progress') && [
                '1.Заказан',
                '2.Кухня',
                '2,5.Комплектация',
                '3.Ожидает',
                '4.В пути',
                '5.Доставлен'
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
        window.addEventListener('resize', this.updateTableHeight);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateTableHeight);
    }

    updateTableHeight = () => {
        const height = window.innerHeight - 165;
        this.setState({ tableHeight: Math.max(height, 300) });
    }

    setupWindowMethods = () => {
        window.list_AddItem = this.addOrder;
        window.list_RemoveItem = this.removeOrder;
        window.list_EditItem = this.editOrder;
        window.list_LoadAllItems = this.loadAllOrders;
    }

    openOrder = (e) => {
        window.show_page('order', e);
    };

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
                paid: order.paid || false
            }));

            this.setState({
                dataSource: formattedOrders,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
            this.setState({ isLoading: false });
        }
    }

    formatOrderDate = (dateString) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;

            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            return `${day}.${month} ${hours}:${minutes}`;
        } catch (e) {
            console.error('Ошибка форматирования даты:', e);
            return dateString;
        }
    }

    getStatusTagConfig = (orderStatus) => {
        const statusMap = {
            'Временной': { color: '#FFEED8', textColor: '#FFAD41', text: '● Временной' },
            '1.Заказан': { color: '#F4E1FB', textColor: '#AB72C2', text: '● Заказан' },
            '2.Кухня': { color: '#FBDBD7', textColor: '#EF7365', text: '● Кухня' },
            '2,5.Комплектация': { color: '#FFF0EF', textColor: '#FC867D', text: '● Комплектация' },
            '3.Ожидает': { color: '#DBF4FB', textColor: '#59B9D5', text: '● Ожидает' },
            '4.В пути': { color: '#FFFAC5', textColor: '#C3B01E', text: '● В пути' },
            '5.Доставлен': { color: '#EEFCF1', textColor: '#63B875', text: '● Доставлен' },
            '6.Деньги сдал': { color: '#D2F0D3', textColor: '#57B55D', text: '● Деньги сдал' },
            '7.На удаление': { color: '#F3E1D0', textColor: '#795C40', text: '● На удаление' },
        };

        return statusMap[orderStatus] || { color: 'geekblue', textColor: 'black', text: `●${orderStatus}` };
    }


    cleanStatusText = (status) => {
        if (!status) return '';

        // Регулярное выражение для удаления:
        // ^ - начало строки
        // [\d,]+ - одна или более цифр или запятых
        // \.? - необязательная точка
        // \s* - необязательные пробелы
        let cleaned = status.replace(/^[\d,]+\.?\s*/, '');

        // Дополнительные замены для читаемости
        cleaned = cleaned.replace('ТТ', 'торговую точку');

        return cleaned;
    };

    renderCellContent = (content, record) => {
        if (record.deleted) {
            return (
                <div style={{
                    textDecoration: 'line-through',
                    opacity: 0.7,
                    color: '#FF4D4F',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    {content}
                </div>
            );
        }
        return <div style={{ width: '100%', textAlign: 'center' }}>{content}</div>;
    }


    renderNumberCell = (_, { orderNumber, id, deleted, paid }) => {
        return (
            <Button
                block
                href='#'
                data-button-id={`open-order-${id}`}
                style={{
                    background: deleted ? '#FFF2F0' : paid ? '#E6F7FF' : 'transparent',
                    borderColor: deleted ? '#FFCCC7' : paid ? '#87e8de' : '#d9d9d9',
                    height: '100%',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Space size={4}>
                    {deleted && <DeleteOutlined style={{ color: '#FF4D4F', fontSize: 14 }} />}
                    {paid && !deleted && <CheckCircleOutlined style={{ color: '#08979C', fontSize: 14 }} />}
                    <a
                        href='#'
                        data-button-id={`open-order-${id}`}
                        style={{
                            textDecoration: deleted ? 'line-through' : 'none',
                            color: deleted ? '#FF4D4F' : paid ? '#08979C' : 'inherit',
                            opacity: deleted ? 0.7 : 1,
                            fontWeight: paid ? 500 : 'normal'
                        }}
                    >
                        {orderNumber.replace(/\s+/g, '').slice(-4)}
                    </a>
                </Space>
            </Button>
        );
    }

    renderStatusTag = (orderStatus, record) => {
        const { color, textColor, text } = this.getStatusTagConfig(orderStatus);
        return (
            <Tag
                color={color}
                style={{
                    width: '100%',
                    minHeight: '32px',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'normal',
                    lineHeight: '1.4',
                    padding: '4px 8px',
                    textDecoration: record.deleted ? 'line-through' : 'none',
                    opacity: record.deleted ? 0.7 : 1
                }}
            >
                <div style={{
                    color: record.deleted ? '#FF4D4F' : textColor,
                    width: '100%',
                    textAlign: 'center'
                }}>
                    {this.cleanStatusText(text)}
                </div>
            </Tag>
        );
    }

    render() {
        const { dataSource, isLoading, tableHeight, statusFilter } = this.state;
        const filteredData = this.filterOrdersByStatus(dataSource);

        const statusFilters = [
            {
                text: 'Текущие',
                value: 'in_progress',
            },
            {
                text: 'Временные',
                value: 'temporary',
            },
            {
                text: 'Выполненные',
                value: 'completed',
            },
            {
                text: 'Удаленные',
                value: 'deleted',
            },
        ];

        const columns = [
            {
                title: 'Дата',
                dataIndex: 'orderDate',
                key: 'orderDate',
                width: 100,
                sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
                render: (dateString, record) => this.renderCellContent(this.formatOrderDate(dateString), record)
            },
            {
                title: '№',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 100,
                sorter: (a, b) => a.orderNumber.localeCompare(b.orderNumber),
                render: this.renderNumberCell
            },
            {
                title: 'Статус',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                width: 180,
                filters: statusFilters,
                filteredValue: statusFilter,
                onFilter: (value, record) => {
                    // Фильтрация реализована в filterOrdersByStatus
                    return true;
                },
                render: this.renderStatusTag
            },
            {
                title: 'Упаковка',
                dataIndex: 'orderPackage',
                key: 'orderPackage',
                width: 120,
                sorter: (a, b) => a.orderPackage.localeCompare(b.orderPackage),
                render: (text, record) => this.renderCellContent(text, record)
            },
            {
                title: 'Оплата',
                dataIndex: 'orderPaymentType',
                key: 'orderPaymentType',
                width: 120,
                sorter: (a, b) => a.orderPaymentType.localeCompare(b.orderPaymentType),
                render: (text, record) => this.renderCellContent(text, record)
            },
            {
                title: 'Сумма',
                dataIndex: 'orderTotal',
                key: 'orderTotal',
                width: 120,
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
                width: 80,
                render: (_, { orderAddress, orderOnlineID, orderPackage, deleted }) => (
                    <Space size='small'>
                        {orderPackage === 'Доставка' && (
                            <Popover
                                content={<div style={{ width: 130 }}>{orderAddress}</div>}
                                title="Адрес"
                                trigger="click"
                            >
                                <HomeOutlined style={{
                                    color: deleted ? '#FF7875' : '#1890ff',
                                    fontSize: '20px'
                                }} />
                            </Popover>
                        )}
                        {orderOnlineID && (
                            <Popover
                                content={<div style={{ width: 130 }}>{orderOnlineID}</div>}
                                title="№ онлайн заказа"
                                trigger="click"
                            >
                                <GlobalOutlined style={{
                                    color: deleted ? '#FF7875' : '#1890ff',
                                    fontSize: '20px'
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

        return (
            <div style={{
                height: `${tableHeight+8}px`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Table
                    size="middle"
                    locale={{
                        emptyText: (
                            <Space>
                                <Loading3QuartersOutlined spin style={{ fontSize: 18, color: '#1890ff' }} />
                                <Text>{isLoading ? 'Загрузка заказов...' : 'Список заказов пуст'}</Text>
                            </Space>
                        )
                    }}
                    columns={columns}
                    dataSource={filteredData}
                    bordered
                    pagination={false}
                    scroll={{ y: tableHeight - 40 }}
                    style={{
                        flex: 1,
                        overflowX: 'auto'
                    }}
                    onChange={(pagination, filters, sorter) => {
                        if (filters.orderStatus) {
                            this.handleStatusFilterChange(filters.orderStatus);
                        }
                    }}
                    components={{
                        body: {
                            cell: (props) => <td {...props} style={{
                                ...props.style,
                                padding: '4px 8px',
                                verticalAlign: 'middle',
                                ...(props.record?.deleted ? {
                                    background: '#FFF2F0',
                                    borderBottom: '1px solid #FFCCC7',
                                    borderRight: '1px solid #FFCCC7'
                                } : {})
                            }} />,
                            row: (props) => <tr {...props} className={props.record?.deleted ? 'deleted-order-row' : ''} />,
                        },
                    }}
                    rowClassName={(record) => record.deleted ? 'deleted-order-row' : ''}
                />
            </div>
        );
    }
}

export default OrdersTable;
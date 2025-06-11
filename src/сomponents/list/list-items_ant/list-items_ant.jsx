import React from 'react';
import { Space, Table, Tag, Typography, Popover, Button } from 'antd';
import { GlobalOutlined, HomeOutlined, Loading3QuartersOutlined } from "@ant-design/icons";

const { Text } = Typography;

class OrdersTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            isLoading: false,
            tableHeight: 600
        };
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
        const height = window.innerHeight - 165; // Подстройте под ваш layout
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

    addOrder = (orderDate, orderNumber, orderStatus, orderPackage,
                orderPaymentType, orderTotal, orderAddress, orderOnlineID, id) => {
        const newItem = {
            orderDate, orderNumber, orderStatus, orderPackage,
            orderPaymentType, orderTotal, orderAddress, orderOnlineID, id
        };

        this.setState(({ dataSource }) => ({
            dataSource: [...dataSource, newItem]
        }));
    }

    removeOrder = (orderNumber) => {
        this.setState(({ dataSource }) => ({
            dataSource: dataSource.filter(item => item.orderNumber !== orderNumber)
        }));
    }

    editOrder = (orderNumber, propertyName, propertyValue) => {
        this.setState(({ dataSource }) => ({
            dataSource: dataSource.map(item =>
                item.orderNumber === orderNumber
                    ? { ...item, [propertyName]: propertyValue }
                    : item
            )
        }));
        return true;
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
                orderOnlineID: order.orderOnlineID || ''
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

    render() {
        const { dataSource, isLoading, tableHeight } = this.state;

        const columns = [
            {
                title: 'Дата',
                dataIndex: 'orderDate',
                key: 'orderDate',
                width: 90,
                sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
                render: (dateString) => this.formatOrderDate(dateString)
            },
            {
                title: '№',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 80,
                sorter: (a, b) => a.orderNumber.localeCompare(b.orderNumber),
                render: (_, { orderNumber, id }) => (
                    <div align='right'>
                        <Space size='small'>
                            <Button>
                                <a href='#' data-button-id={`open-order-${id}`}>
                                    {orderNumber.replace(/\s+/g, '').slice(-4)}
                                </a>
                            </Button>
                        </Space>
                    </div>
                )
            },
            {
                title: 'Статус',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                width: 180,
                filters: [
                    { text: 'Выполненные заказы', value: '6.Деньги сдал' },
                    { text: 'Временные заказы', value: 'Временной' },
                ],
                onFilter: (value, record) => record.orderStatus.includes(value),
                sorter: (a, b) => a.orderStatus.localeCompare(b.orderStatus),
                render: (_, { orderStatus }) => {
                    const { color, textColor, text } = this.getStatusTagConfig(orderStatus);
                    return (
                        <div align='left'>
                            <Tag color={color} key={orderStatus}>
                                <div style={{ color: textColor }}>{text.toUpperCase()}</div>
                            </Tag>
                        </div>
                    );
                }
            },
            {
                title: 'Упаковка',
                dataIndex: 'orderPackage',
                key: 'orderPackage',
                width: 100,
                sorter: (a, b) => a.orderPackage.localeCompare(b.orderPackage),
                render: (text) => <div align='right'>{text}</div>
            },
            {
                title: 'Оплата',
                dataIndex: 'orderPaymentType',
                key: 'orderPaymentType',
                width: 100,
                sorter: (a, b) => a.orderPaymentType.localeCompare(b.orderPaymentType),
                render: (text) => <div align='right'>{text}</div>
            },
            {
                title: 'Сумма',
                dataIndex: 'orderTotal',
                key: 'orderTotal',
                width: 100,
                sorter: (a, b) => a.orderTotal - b.orderTotal,
                render: (text) => <div align='right'>{text} ₽</div>
            },
            {
                title: 'Адрес',
                dataIndex: 'orderAddress',
                key: 'orderAddress',
                hidden: true,
                width: 250,
                sorter: (a, b) => a.orderAddress.localeCompare(b.orderAddress),
                render: (text) => <Text style={{ fontSize: '12px' }}>{text?.substring(0, 27)}</Text>
            },
            {
                title: '',
                dataIndex: 'tags',
                key: 'tags',
                width: 80,
                render: (_, { orderAddress, orderOnlineID, orderPackage }) => (
                    <Space size='small'>
                        {orderPackage === 'Доставка' && (
                            <Popover
                                content={<div style={{ width: 130 }}>{orderAddress}</div>}
                                title="Адрес"
                                trigger="click"
                            >
                                <HomeOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                            </Popover>
                        )}
                        {orderOnlineID && (
                            <Popover
                                content={<div style={{ width: 130 }}>{orderOnlineID}</div>}
                                title="№ онлайн заказа"
                                trigger="click"
                            >
                                <GlobalOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
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
                            <div>
                                <Loading3QuartersOutlined spin />
                                {isLoading ? 'Загрузка заказов...' : 'Список заказов пуст'}
                            </div>
                        )
                    }}
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    pagination={false}
                    scroll={{ y: tableHeight - 40 }} // Учитываем высоту заголовка
                    style={{
                        flex: 1,
                        overflowX: 'auto'
                    }}
                    components={{
                        body: {
                            cell: (props) => <td {...props} style={{ ...props.style, padding: '8px 12px' }} />,
                        },
                    }}
                />
            </div>
        );
    }
}

export default OrdersTable;
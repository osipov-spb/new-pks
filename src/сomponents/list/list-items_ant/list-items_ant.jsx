import React from 'react'
import {Space, Table, Tag, Typography, Popover, Button} from 'antd'
import {
    GlobalOutlined,
    HomeOutlined,
    Loading3QuartersOutlined
} from "@ant-design/icons";

const {Text, Title} = Typography;


class _Table extends React.Component {
    openOrder = (e) => {
        window.show_page('order', e)
    };
    constructor(props) {
        super(props);

        this.state = {}
    }
    componentDidMount() {
        const data = [];

        this.setState({
            dataSource: data
        })

        window.list_AddItem = (orderDate, orderNumber, orderStatus, orderPackage,
                               orderPaymentType, orderTotal, orderAddress, orderOnlineID, id) => {
            const newItem = {
                orderDate, orderNumber, orderStatus, orderPackage,
                orderPaymentType, orderTotal, orderAddress, orderOnlineID, id
            };

            this.setState(({dataSource}) => {
                const newData = [...dataSource, newItem];
                return {
                    dataSource: newData
                }
            });
        }
        window.list_RemoveItem = (orderNumber) => {
            this.setState(({dataSource}) => {
                    const newData = [];
                    dataSource.forEach((dataElement) => {
                        if (dataElement.orderNumber !== orderNumber) {
                            newData.push(dataElement)
                        }
                    })
                    return {
                        dataSource: newData
                    }
                }
            );
        }

        window.list_EditItem = (orderNumber, pName, pValue) => {
            const newData = [...this.state.dataSource];
            const newData2 = []
            newData.forEach((dataElement) => {
                if (dataElement.orderNumber == orderNumber) {
                    dataElement[pName] = pValue
                }
                newData2.push(dataElement)
            })
            this.setState(({dataSource: newData2}));

            return true
        }
    }

    render() {
        const columns = [
            {
                title: 'Дата',
                dataIndex: 'orderDate',
                key: 'orderDate',
                width: '10%',
            },
            {
                title: '№',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: '8%',
                render: (_, {orderNumber, id}) => {
                    let tagName = 'open-order-' + id
                    return (
                        <div align='right'>
                            <Space size='small'>
                                <Button>
                                <a href='#' data-button-id={tagName}>
                                    {orderNumber.replace(/\s+/g, '').slice(-4)}
                                </a>
                                </Button>
                            </Space>
                        </div>)
                }
            },
            {
                title: 'Статус',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                width: '17%',
                filters: [
                    {
                        text: 'Выполненные заказы',
                        value: ['6.Деньги сдал'],
                    },
                    {
                        text: 'Временные заказы',
                        value: ['Временной']
                    },
                ],

                // filteredValue: this.state.filteredInfo.orderStatus || null,
                onFilter: (value, record) => value.indexOf(record.orderStatus) != -1,
                sorter: (a, b) => a.orderStatus.localeCompare(b.orderStatus),
                render: (_, {orderStatus}) => {
                    let color = 'geekblue';
                    let text_color = 'black'
                    let statusText = "●" + orderStatus;
                    if (orderStatus === 'Временной') {
                        color = '#FFEED8';
                        text_color = '#FFAD41';
                        statusText = '● Временной';
                    } else if (orderStatus === '1.Заказан') {
                        color = '#F4E1FB';
                        text_color = '#AB72C2';
                        statusText = '● Заказан';
                    } else if (orderStatus === '2.Кухня') {
                        color = '#FBDBD7';
                        text_color = '#EF7365';
                        statusText = '● Кухня';
                    } else if (orderStatus === '2,5.Комплектация') {
                        color = '#FFF0EF';
                        text_color = '#FC867D';
                        statusText = '● Комплектация';
                    } else if (orderStatus === '3.Ожидает') {
                        color = '#DBF4FB';
                        text_color = '#59B9D5';
                        statusText = '● Ожидает';
                    } else if (orderStatus === '4.В пути') {
                        color = '#FFFAC5';
                        text_color = '#C3B01E';
                        statusText = '● В пути';
                    } else if (orderStatus === '5.Доставлен') {
                        color = '#EEFCF1';
                        text_color = '#63B875';
                        statusText = '● Доставлен';
                    } else if (orderStatus === '6.Деньги сдал') {
                        color = '#D2F0D3';
                        text_color = '#57B55D';
                        statusText = '● Деньги сдал';
                    } else if (orderStatus === '7.На удаление') {
                        color = '#F3E1D0';
                        text_color = '#795C40';
                        statusText = '● На удаление';
                    }
                    return (
                        <div align='left'><Tag color={color} key={orderStatus}>
                            <div style={{color: text_color}}>{statusText.toUpperCase()}</div>
                        </Tag></div>
                    );
                }

            },
            {
                title: 'Упаковка',
                dataIndex: 'orderPackage',
                key: 'orderPackage',
                width: '10%',
                sorter: (a, b) => a.orderPackage.localeCompare(b.orderPackage),
                render: (_, {orderPackage}) => {
                    return (<div align='right'>{orderPackage}</div>)
                }
            },
            {
                title: 'Оплата',
                dataIndex: 'orderPaymentType',
                key: 'orderPaymentType',
                width: '10%',
                sorter: (a, b) => a.orderPaymentType.localeCompare(b.orderPaymentType),
                render: (_, {orderPaymentType}) => {
                    return (<div align='right'>{orderPaymentType}</div>)
                }
            },
            {
                title: 'Сумма',
                dataIndex: 'orderTotal',
                key: 'orderTotal',
                width: '10%',
                sorter: {
                    compare: (a, b) => a.orderTotal - b.orderTotal,
                    multiple: 2,
                },
                render: (_, {orderTotal}) => {
                    return (<div align='right'>{orderTotal} ₽</div>)
                }

            },
            {
                title: 'Адрес',
                dataIndex: 'orderAddress',
                key: 'orderAddress',
                width: '31%',
                sorter: (a, b) => a.orderAddress.localeCompare(b.orderAddress),
                render: (_, {orderAddress}) => {return (<Text style={{ fontSize: '12' +
                        'px' }}>{orderAddress.substring(0, 27)}</Text>)}
            },
            {
                title: '',
                dataIndex: 'tags',
                key: 'tags',
                width: '6%',
                render: (_, {orderAddress, orderOnlineID, orderPackage}) => {
                    return (
                        <Space size='small'>
                            {(orderPackage == 'Доставка') ? <Popover content={
                                <div style={{ width: 130 }}>{orderAddress}</div>} title="Адрес" trigger="click">
                                <HomeOutlined style={{color: '#1890ff', fontSize: '25px'}}/>
                            </Popover>: ''}

                            {(orderOnlineID !== '') ? <Popover content={
                                <div style={{ width: 130 }}>{orderOnlineID}</div>} title="№ онлайн заказа" trigger="click">
                                <GlobalOutlined style={{color: '#1890ff', fontSize: '25px'}}/>
                            </Popover>: ''}

                        </Space>
                    )
                }
            },
            {
                title: 'id',
                dataIndex: 'id',
                key: 'id',
                hidden: true
            },
        ].filter(item => !item.hidden);
        return (
            <Table size='middle' locale={{
                emptyText: (
                    <div><Loading3QuartersOutlined spin /> Список заказов пуст</div>)
            }} pagination={{ defaultPageSize: 8, showSizeChanger: false, position:['bottomRight']}} columns={columns} dataSource={this.state.dataSource} bordered/>
        )
    }
}

export default _Table;
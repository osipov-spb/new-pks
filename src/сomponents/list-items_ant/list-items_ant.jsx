import React from 'react'
import {Space, Table, Tag, Typography, Popover} from 'antd'
import {GlobalOutlined, HomeOutlined} from "@ant-design/icons";

const {Text, Title} = Typography;

class _Table extends React.Component {
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
                               orderPaymentType, orderTotal, orderAddress, orderID) => {
            const newItem = {
                orderDate, orderNumber, orderStatus, orderPackage,
                orderPaymentType, orderTotal, orderAddress, orderID
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
                title: 'Дата и время',
                dataIndex: 'orderDate',
                key: 'orderDate',
            },
            {
                title: '№ заказа',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                render: (_, {orderNumber, orderAddress}) => {
                    let tagName = 'list-open-order-' + orderNumber

                    return (
                        <div align='right'>
                            <Space size='small'>
                                <a href='#' data-button-id={tagName}>
                                    {orderNumber.replace(/\s+/g, '').slice(-4)}
                                </a>
                            </Space>
                        </div>)
                }
            },
            {
                title: 'Статус',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                sorter: (a, b) => a.orderStatus.localeCompare(b.orderStatus),
                render: (_, {orderStatus}) => {
                    let color = 'geekblue';
                    let statusText = "●" + orderStatus;
                    if (orderStatus === 'Временной') {
                        color = 'lime';
                        statusText = '● Временной';
                    } else if (orderStatus === '1.Заказан') {
                        color = 'magenta';
                        statusText = '● Заказан';
                    } else if (orderStatus === '2.Кухня') {
                        color = 'red';
                        statusText = '● Кухня';
                    } else if (orderStatus === '2,5.Комплектация') {
                        color = 'volcano';
                        statusText = '● Комплектация';
                    } else if (orderStatus === '3.Ожидает') {
                        color = 'blue';
                        statusText = '● Ожидает';
                    } else if (orderStatus === '4.В пути') {
                        color = 'gold';
                        statusText = '● В пути';
                    } else if (orderStatus === '5.Доставлен') {
                        color = 'cyan';
                        statusText = '● Доставлен';
                    } else if (orderStatus === '6.Деньги сдал') {
                        color = 'green';
                        statusText = '● Деньги сдал';
                    } else if (orderStatus === '7.На удаление') {
                        color = 'orange';
                        statusText = '● На удаление';
                    }
                    return (
                        <div align='left'><Tag color={color} key={orderStatus}>
                            {statusText.toUpperCase()}
                        </Tag></div>
                    );
                }

            },
            {
                title: 'Упаковка',
                dataIndex: 'orderPackage',
                key: 'orderPackage',
                sorter: (a, b) => a.orderPackage.localeCompare(b.orderPackage),
                render: (_, {orderPackage}) => {
                    return (<div align='right'>{orderPackage}</div>)
                }
            },
            {
                title: 'Тип оплаты',
                dataIndex: 'orderPaymentType',
                key: 'orderPaymentType',
                sorter: (a, b) => a.orderPaymentType.localeCompare(b.orderPaymentType),
                render: (_, {orderPaymentType}) => {
                    return (<div align='right'>{orderPaymentType}</div>)
                }
            },
            {
                title: 'Сумма',
                dataIndex: 'orderTotal',
                key: 'orderTotal',
                sorter: {
                    compare: (a, b) => a.orderTotal - b.orderTotal,
                    multiple: 2,
                },
                render: (_, {orderTotal}) => {
                    return (<div align='right'>{orderTotal} ₽</div>)
                }

            },
            // {
            //     title: 'Адрес',
            //     dataIndex: 'orderAddress',
            //     key: 'orderAddress',
            //     sorter: (a, b) => a.orderAddress.localeCompare(b.orderAddress),
            //     render: (_, {orderAddress}) => {return (<Text style={{ fontSize: '12' +
            //             'px' }}>{orderAddress}</Text>)}
            // },
            // {
            //     title: 'ID заказа',
            //     dataIndex: 'orderID',
            //     key: 'orderID',
            //     render: (_, {orderID}) => {return (<div align='right'>{orderID}</div>)}
            // },
            {
                title: '',
                dataIndex: 'tags',
                key: 'tags',
                render: (_, {orderAddress, orderID}) => {
                    return (
                        <Space size='small'>
                            <Popover content={


                                <div style={{ width: 130 }}>{orderAddress}</div>} title="Адрес" trigger="click">
                                <HomeOutlined style={{color: '#1890ff', fontSize: '20px'}}/>
                            </Popover>
                            {(orderID !== '') ? <GlobalOutlined style={{color: '#1890ff', fontSize: '20px'}}/> : ''}
                        </Space>
                    )
                }
            },
        ];

        return (
            <Table columns={columns} dataSource={this.state.dataSource} bordered/>
        )
    }
}

export default _Table;
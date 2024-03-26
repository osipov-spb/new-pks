import React from 'react'
import {Table, Tag} from 'antd'

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
            },
            {
                title: 'Статус',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                sorter: (a, b) => a.orderStatus.localeCompare(b.orderStatus),
                render: (_, {orderStatus}) => {
                    let color = 'geekblue';
                    if (orderStatus === 'Временной') {
                        color = 'lime';
                    } else if (orderStatus === '1.Заказан') {
                        color = 'magenta';
                    } else if (orderStatus === '2.Кухня') {
                        color = 'red';
                    } else if (orderStatus === '2,5.Комплектация') {
                        color = 'volcano';
                    } else if (orderStatus === '3.Ожидает') {
                        color = 'blue';
                    } else if (orderStatus === '4.В пути') {
                        color = 'gold';
                    } else if (orderStatus === '5.Доставлен') {
                        color = 'cyan';
                    } else if (orderStatus === '6.Деньги сдал') {
                        color = 'green';
                    } else if (orderStatus === '7.На удаление') {
                        color = 'orange';
                    }
                    return (
                        <Tag color={color} key={orderStatus}>
                            {orderStatus.toUpperCase()}
                        </Tag>
                    );
                }

            },
            {
                title: 'Упаковка',
                dataIndex: 'orderPackage',
                key: 'orderPackage',
                sorter: (a, b) => a.orderPackage.localeCompare(b.orderPackage),
                render: (_, {orderPackage}) => {return (<>{orderPackage}</>)}
            },
            {
                title: 'Тип оплаты',
                dataIndex: 'orderPaymentType',
                key: 'orderPaymentType',
                sorter: (a, b) => a.orderPaymentType.localeCompare(b.orderPaymentType),
                render: (_, {orderPaymentType}) => {return (<>{orderPaymentType}</>)}
            },
            {
                title: 'Сумма',
                dataIndex: 'orderTotal',
                key: 'orderTotal',
                sorter: {
                    compare: (a, b) => a.orderTotal - b.orderTotal,
                    multiple: 2,
                },
                render: (_, {orderTotal}) => {return (<>{orderTotal}</>)}

            },
            {
                title: 'Адрес',
                dataIndex: 'orderAddress',
                key: 'orderAddress',
                sorter: (a, b) => a.orderAddress.localeCompare(b.orderAddress),
                render: (_, {orderAddress}) => {return (<>{orderAddress}</>)}
            },
            {
                title: 'ID заказа',
                dataIndex: 'orderID',
                key: 'orderID',
            },
        ];

        return (
            <Table columns={columns} dataSource={this.state.dataSource} bordered/>
        )
    }
}

export default _Table;
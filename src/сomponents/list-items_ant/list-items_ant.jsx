import React from 'react'
import {Table, Tag} from 'antd'

class NewTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        const data = [];

        this.setState({
            dataSource: data
        })

        window.AddItem = (orderDate, orderNumber, orderStatus, orderPackage,
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
        window.RemoveItem = (orderNumber) => {
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
            });
        }

        window.EditItem = (orderNumber, change) => {
            this.setState(({dataSource}) => {
                const newData = [];
                dataSource.forEach((dataElement) => {
                    if (dataElement.orderNumber == orderNumber) {
                        dataElement[change.pName] = change.pValue
                    }
                })
                newData.push({
                    'orderDate':'orderDate', 'orderNumber':'orderDate', 'orderStatus':'orderDate', 'orderPackage':'orderDate',
                    'orderPaymentType':'orderDate', 'orderTotal':'orderDate', 'orderAddress':'orderDate', 'orderID':'orderDate',
                })
                return {
                    dataSource: newData
                }
            });
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
                        color = '#fff1b8';
                    } else if (orderStatus === '1.Заказан') {
                        color = '#d3adf7';
                    } else if (orderStatus === '2.Кухня') {
                        color = '#ffa39e';
                    } else if (orderStatus === '2,5.Комплектация') {
                        color = '#ffccc7';
                    } else if (orderStatus === '3.Ожидает') {
                        color = '#bae7ff';
                    } else if (orderStatus === '4.В пути') {
                        color = '#fffb8f';
                    } else if (orderStatus === '5.Доставлен') {
                        color = '#d9f7be';
                    } else if (orderStatus === '6.Деньги сдал') {
                        color = '#b7eb8f';
                    } else if (orderStatus === '7.На удаление') {
                        color = '#ad6800';
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
            },
            {
                title: 'Тип оплаты',
                dataIndex: 'orderPaymentType',
                key: 'orderPaymentType',
                sorter: (a, b) => a.orderPaymentType.localeCompare(b.orderPaymentType),
            },
            {
                title: 'Сумма',
                dataIndex: 'orderTotal',
                key: 'orderTotal',
                sorter: {
                    compare: (a, b) => a.orderTotal - b.orderTotal,
                    multiple: 2,
                }
            },
            {
                title: 'Адрес',
                dataIndex: 'orderAddress',
                key: 'orderAddress',
                sorter: (a, b) => a.orderPaymentType.localeCompare(b.orderPaymentType)
            },
            {
                title: 'ID заказа',
                dataIndex: 'orderID',
                key: 'orderID',
            },
        ];


        return (
            <div>
                <Table columns={columns} dataSource={this.state.dataSource} bordered>
                </Table>
            </div>
        )
    }
}

export default NewTable;
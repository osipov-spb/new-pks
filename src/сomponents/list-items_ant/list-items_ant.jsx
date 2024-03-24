import React from 'react'
import {Card, Table, Tag} from 'antd'

class NewTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        const data = [];

        this.setState({
            dataSource : data
        })

        window.AddItem = (orderDate, orderNumber, orderStatus, orderPackage,
                          orderPaymentType, orderTotal, orderAddress, orderID) => {
            const newItem = {orderDate, orderNumber, orderStatus, orderPackage,
                orderPaymentType, orderTotal, orderAddress, orderID};

            this.setState(({dataSource}) => {
                const newData = [...dataSource, newItem];
                return {
                    dataSource: newData
                }
            });
        }
        window.RemoveItem = (orderID) => {
            this.setState(({dataSource}) => {
                const newData = [];
                dataSource.forEach((dataElement) =>{
                    if (dataElement.orderID !== orderID){
                        newData.push(dataElement)
                    }
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
                render: (_, { orderStatus }) => {
                    let color = 'geekblue';
                    if (orderStatus === 'Временной') {
                        color = 'volcano';
                    } else if (orderStatus === '1.Заказан') {
                        color = 'volcano';
                    } else if (orderStatus === '2.Кухня') {
                        color = 'volcano';
                    } else if (orderStatus === '2,5.Комплектация') {
                        color = 'volcano';
                    } else if (orderStatus === '3.Ожидает') {
                        color = 'volcano';
                    } else if (orderStatus === '4.В пути') {
                        color = 'volcano';
                    } else if (orderStatus === '5.Доставлен') {
                        color = 'volcano';
                    } else if (orderStatus === '6.Деньги сдал') {
                        color = 'volcano';
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
            },
            {
                title: 'Тип оплаты',
                dataIndex: 'orderPaymentType',
                key: 'orderPaymentType',
            },
            {
                title: 'Сумма',
                dataIndex: 'orderTotal',
                key: 'orderTotal',
            },
            {
                title: 'Адрес',
                dataIndex: 'orderAddress',
                key: 'orderAddress',
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
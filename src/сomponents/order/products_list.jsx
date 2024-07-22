import React from 'react'
import {Space, Table, Tag, Typography, Popover, Empty, Button} from 'antd'
import {
    ClockCircleFilled,
    FrownFilled,
    GlobalOutlined,
    HomeOutlined,
    Loading3QuartersOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import Icon from "antd/es/icon";

const {Text, Title} = Typography;

class _ProductTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        const locale = {
            emptyText: 'Abc',
        }

        const data = [];

        this.setState({
            dataSource: data
        })

        window.order_product_list_AddItem = (lineNumber, product, count, price,
                               total) => {
            const newItem = {
                lineNumber, product, count, price,
                total
            };

            this.setState(({dataSource}) => {
                const newData = [...dataSource, newItem];
                return {
                    dataSource: newData
                }
            });
        }
        window.order_product_list_RemoveItem = (lineNumber) => {
            this.setState(({dataSource}) => {
                    const newData = [];
                    dataSource.forEach((dataElement) => {
                        if (dataElement.lineNumber !== lineNumber) {
                            newData.push(dataElement)
                        }
                    })
                    return {
                        dataSource: newData
                    }
                }
            );
        }

        window.order_product_list_EditItem = (lineNumber, pName, pValue) => {
            const newData = [...this.state.dataSource];
            const newData2 = []
            newData.forEach((dataElement) => {
                if (dataElement.lineNumber == lineNumber) {
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
                title: '№',
                dataIndex: 'lineNumber',
                key: 'lineNumber',
            },
            {
                title: 'Товары',
                dataIndex: 'product',
                key: 'product',
                // render: (_, {orderNumber, orderID}) => {
                //     let tagName = 'list-open-order-' + orderNumber
                //     return (
                //         <div align='right'>
                //
                //             <Space size='small'>
                //                 {/*{(orderID !== '') ? <GlobalOutlined style={{color: '#1890ff'}}/> : ''}*/}
                //                 <a href='#' data-button-id={tagName}>
                //                     {orderNumber.replace(/\s+/g, '').slice(-4)}
                //                 </a>
                //
                //             </Space>
                //         </div>)
                // }
            },
            {
                title: 'Кол-во',
                dataIndex: 'count',
                key: 'count',
                // sorter: (a, b) => a.orderStatus.localeCompare(b.orderStatus),
                // render: (_, {orderStatus}) => {
                //     let color = 'geekblue';
                //     let statusText = "●" + orderStatus;
                //     if (orderStatus === 'Временной') {
                //         color = 'lime';
                //         statusText = '● Временной';
                //     } else if (orderStatus === '1.Заказан') {
                //         color = 'magenta';
                //         statusText = '● Заказан';
                //     } else if (orderStatus === '2.Кухня') {
                //         color = 'red';
                //         statusText = '● Кухня';
                //     } else if (orderStatus === '2,5.Комплектация') {
                //         color = 'volcano';
                //         statusText = '● Комплектация';
                //     } else if (orderStatus === '3.Ожидает') {
                //         color = 'blue';
                //         statusText = '● Ожидает';
                //     } else if (orderStatus === '4.В пути') {
                //         color = 'gold';
                //         statusText = '● В пути';
                //     } else if (orderStatus === '5.Доставлен') {
                //         color = 'cyan';
                //         statusText = '● Доставлен';
                //     } else if (orderStatus === '6.Деньги сдал') {
                //         color = 'green';
                //         statusText = '● Деньги сдал';
                //     } else if (orderStatus === '7.На удаление') {
                //         color = 'orange';
                //         statusText = '● На удаление';
                //     }
                //     return (
                //         <div align='left'><Tag color={color} key={orderStatus}>
                //             {statusText.toUpperCase()}
                //         </Tag></div>
                //     );
                // }

            },
            {
                title: 'Цена',
                dataIndex: 'price',
                key: 'price',
                // sorter: (a, b) => a.orderPackage.localeCompare(b.orderPackage),
                // render: (_, {orderPackage}) => {
                //     return (<div align='right'>{orderPackage}</div>)
                // }
            },
            {
                title: 'Сумма',
                dataIndex: 'total',
                key: 'total',
                // sorter: (a, b) => a.orderPaymentType.localeCompare(b.orderPaymentType),
                // render: (_, {orderPaymentType}) => {
                //     return (<div align='right'>{orderPaymentType}</div>)
                // }
            }
        ];

        return (
            <Table locale={{
                emptyText: (
                    <div><Loading3QuartersOutlined spin /> Пусто</div>)
            }} pagination={{ defaultPageSize: 9, showSizeChanger: false, position:['bottomRight']}} columns={columns} dataSource={this.state.dataSource} bordered/>
        )
    }
}

export default _ProductTable;
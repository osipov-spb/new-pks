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
import './products_list.css'
import Icon from "antd/es/icon";

const {Text, Title} = Typography;

class _ProductTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            setItemsList: this.props.setItemsList
        }
    }

    componentDidMount() {
        const locale = {
            emptyText: 'Abc'
        }

        const data = [];

        this.setState({
            dataSource: data
        })

        window.order_product_list_AddItem = (product_title, product_id, price) => {
            // let current_count = this.state.dataSource.length;

            let added = false;
            if (this.state.dataSource.length > 0) {
                for (let i = 0; i < this.state.dataSource.length; ++i) {
                    let dataElement = this.state.dataSource[i];
                    console.log(this.state.dataSource)
                    console.log(dataElement.product_id + ' ' + product_id)
                    console.log(dataElement.price + ' ' + price)
                    if (dataElement.product_id == product_id && dataElement.price == price) {
                        const newData = [...this.state.dataSource];
                        const newData2 = []
                        newData.forEach((dataElement2) => {
                            if (dataElement2.lineNumber == dataElement.lineNumber) {
                                dataElement2.count = dataElement2.count + 1
                                dataElement2.total = dataElement2.total + dataElement.price
                            }
                            newData2.push(dataElement2)
                        })

                        this.setState(() => {
                            return {
                                dataSource: newData2
                            }
                        });
                        added = true;
                        break;
                    }
                }
            }

            if (this.state.dataSource.length == 0 || !added) {
                const lineNumber = (this.state.dataSource.length + 1).toString()
                const count = 1
                const total = price
                const promo_id = null
                const newItem = {
                    lineNumber, product_title, count, price,
                    total, product_id, promo_id
                };
                console.log('newItem')
                console.log(newItem)
                console.log('this.state')
                console.log(this.state)
                this.setState(({dataSource}) => {
                    const newData = [...dataSource, newItem];
                    return {
                        dataSource: newData
                    }
                });
            }
            this.state.setItemsList(this.state.dataSource);
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

        window.orderProductListLoadItems = (items) => {
            this.setState(({dataSource: items}));
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
                dataIndex: 'product_title',
                key: 'product_title',
                render: (_, {product_title}) => {
                    return (
                        <div style={{fontSize: '11px'}}>
                            {product_title}
                        </div>)
                }
            },
            {
                title: 'Кол-во',
                dataIndex: 'count',
                key: 'count',
                render: (_, {count}) => {
                    return (
                        <div style={{fontSize: '11px'}}>
                            {count}
                        </div>)
                }

            },
            {
                title: 'Цена',
                dataIndex: 'price',
                key: 'price',
                render: (_, {price}) => {
                    return (
                        <div style={{fontSize: '11px'}}>
                            {price}
                        </div>)}
            },
            {
                title: 'Сумма',
                dataIndex: 'total',
                key: 'total',
                render: (_, {total}) => {
                    return (
                        <div style={{fontSize: '11px'}}>
                            {total}
                        </div>)}
            },
            {
                title: 'product_id',
                dataIndex: 'product_id',
                key: 'product_id',
                hidden: true
            },
            {
                title: 'promo_id',
                dataIndex: 'promo_id',
                key: 'promo_id',
                hidden: true
            }
        ].filter(item => !item.hidden);

        return (
            <div><Table size='small' locale={{
                emptyText: (
                    <div><Loading3QuartersOutlined spin /> Пусто</div>)
            }} pagination={{ defaultPageSize: 6, showSizeChanger: false, position:['bottomRight']}} columns={columns} dataSource={this.state.dataSource} bordered/></div>
        )
    }
}

export default _ProductTable;
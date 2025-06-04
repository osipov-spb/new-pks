import React from 'react';
import { Table, Typography, InputNumber, Button, Popconfirm, message, Row, Col, Pagination } from 'antd';
import { Loading3QuartersOutlined, DeleteOutlined } from "@ant-design/icons";
import './products_list.css';

const { Text } = Typography;

class _ProductTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            editingKey: null,
            pagination: {
                current: 1,
                pageSize: 5,
            }
        };
    }

    renderPagination = () => {
        const { pagination, dataSource } = this.state;
        const total = dataSource.length;
        const { current, pageSize } = pagination;

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    size="small"
                    disabled={current === 1}
                    onClick={() => this.handleTableChange({ current: current - 1, pageSize })}
                >
                    &lt;
                </Button>
                <span style={{ margin: '0 8px' }}>
                    {current} / {Math.ceil(total / pageSize)}
                </span>
                <Button
                    size="small"
                    disabled={current === Math.ceil(total / pageSize) || total === 0}
                    onClick={() => this.handleTableChange({ current: current + 1, pageSize })}
                >
                    &gt;
                </Button>
            </div>
        );
    };


    handleCountChange = (lineNumber, value) => {
        if (value === null || value === undefined) {
            this.editItem(lineNumber, 'count', 1);
            return;
        }

        if (value <= 0) {
            this.editItem(lineNumber, 'count', 1);
            message.warning('Минимальное количество - 1');
            return;
        }

        this.editItem(lineNumber, 'count', value);
    };

    handleTableChange = (pagination) => {
        this.setState({ pagination });
    };

    componentDidMount() {
        window.order_product_list_AddItem = (product_title, product_id, price) => {
            this.addOrUpdateItem(product_title, product_id, price);
        };

        window.order_product_list_RemoveItem = (lineNumber) => {
            this.removeItem(lineNumber);
        };

        window.orderProductListLoadItems = (items) => {
            this.setState({ dataSource: items }, () => {
                this.updateParentItemsList();
            });
        };

        window.order_product_list_EditItem = (lineNumber, pName, pValue) => {
            this.editItem(lineNumber, pName, pValue);
            return true;
        };
    }

    addOrUpdateItem = (product_title, product_id, price) => {
        this.setState(prevState => {
            let newData = [...prevState.dataSource];
            let added = false;

            const existingItemIndex = newData.findIndex(
                item => item.product_id === product_id && item.price === price
            );

            if (existingItemIndex >= 0) {
                newData[existingItemIndex] = {
                    ...newData[existingItemIndex],
                    count: newData[existingItemIndex].count + 1,
                    total: (newData[existingItemIndex].count + 1) * price
                };
                added = true;
            }

            if (!added) {
                const lineNumber = (newData.length + 1).toString();
                newData.push({
                    lineNumber,
                    product_title,
                    count: 1,
                    price,
                    total: price,
                    product_id,
                    promo_id: null
                });
            }

            return { dataSource: newData };
        }, this.updateParentItemsList);
    };

    removeItem = (lineNumber) => {
        this.setState(prevState => {
            const newData = prevState.dataSource.filter(
                item => item.lineNumber !== lineNumber
            );

            return {
                dataSource: newData.map((item, index) => ({
                    ...item,
                    lineNumber: (index + 1).toString()
                }))
            };
        }, this.updateParentItemsList);
    };

    editItem = (lineNumber, pName, pValue) => {
        this.setState(prevState => {
            const newData = prevState.dataSource.map(item => {
                if (item.lineNumber === lineNumber) {
                    const updatedItem = { ...item, [pName]: pValue };

                    if (pName === 'count') {
                        updatedItem.total = updatedItem.count * updatedItem.price;
                    }

                    if (pName === 'price') {
                        updatedItem.total = updatedItem.count * updatedItem.price;
                    }

                    return updatedItem;
                }
                return item;
            });
            return { dataSource: newData };
        }, this.updateParentItemsList);
    };

    updateParentItemsList = () => {
        this.props.setItemsList(this.state.dataSource);
    };

    render() {
        const { dataSource, pagination } = this.state;

        const columns = [
            {
                title: '№',
                dataIndex: 'lineNumber',
                key: 'lineNumber',
                width: 50,
            },
            {
                title: 'Товары',
                dataIndex: 'product_title',
                key: 'product_title',
                render: (_, { product_title }) => (
                    <div style={{ fontSize: '11px' }}>{product_title}</div>
                )
            },
            {
                title: 'Кол-во',
                dataIndex: 'count',
                key: 'count',
                width: 100,
                render: (_, record) => (
                    <InputNumber
                        disabled={this.props.disabled}
                        min={1}
                        max={999}
                        value={record.count}
                        onChange={(value) => this.handleCountChange(record.lineNumber, value)}
                        onBlur={() => {
                            if (!record.count || record.count < 1) {
                                this.editItem(record.lineNumber, 'count', 1);
                            }
                        }}
                        size="small"
                        style={{ width: '60px' }}
                        precision={0}
                        parser={(value) => {
                            return parseInt(value.replace(/[^\d]/g, '')) || 1;
                        }}
                        formatter={(value) => {
                            return `${value}`.replace(/[^\d]/g, '');
                        }}
                    />
                )
            },
            {
                title: 'Цена',
                dataIndex: 'price',
                key: 'price',
                width: 100,
                render: (_, { price }) => (
                    <div style={{ fontSize: '11px' }}>{price} ₽</div>
                )
            },
            {
                title: 'Сумма',
                dataIndex: 'total',
                key: 'total',
                width: 100,
                render: (_, { total }) => (
                    <div style={{ fontSize: '11px' }}>{total} ₽</div>
                )
            },
            {
                title: '',
                key: 'actions',
                width: 80,
                render: (_, record) => (
                    <div style={{
                            pointerEvents: this.props.disabled ? 'none' : 'auto'}}>
                        <Popconfirm
                            title="Удалить позицию?"
                            onConfirm={() => this.removeItem(record.lineNumber)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button
                                disabled={this.props.disabled}
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                                type="text"
                            />
                        </Popconfirm>
                    </div>
                )
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
            <div style={{visibility: this.props.hidden ? 'hidden' : 'visible'}}>
                <Row
                    align="middle"
                    justify="space-between"
                    style={{
                        padding: '8px 16px',
                        background: '#f5f5f5',
                        borderBottom: '1px solid #e8e8e8'
                    }}
                >
                    <Col>
                        <Text strong style={{color: '#595959'}}>СПИСОК ТОВАРОВ</Text>
                    </Col>
                    <Col>
                        {this.renderPagination()}
                    </Col>
                </Row>
                <Table
                    size='small'
                    locale={{
                        emptyText: (
                            <div><Loading3QuartersOutlined spin/> Пусто</div>
                        )
                    }}
                    pagination={false}
                    columns={columns}
                    dataSource={dataSource.slice(
                        (pagination.current - 1) * pagination.pageSize,
                        pagination.current * pagination.pageSize
                    )}
                    bordered
                    rowKey="lineNumber"
                />
            </div>
        );
    }
}

export default _ProductTable;
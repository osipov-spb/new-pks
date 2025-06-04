import React from 'react';
import { Table, Typography, InputNumber, Button, Popconfirm, message } from 'antd';
import { Loading3QuartersOutlined, DeleteOutlined } from "@ant-design/icons";
import './products_list.css';

const { Text } = Typography;

class _ProductTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            editingKey: null // Добавляем ключ редактируемой строки
        };
    }

    handleCountChange = (lineNumber, value) => {
        // Если значение undefined или null (когда поле пустое)
        if (value === null || value === undefined) {
            // Устанавливаем минимальное значение 1, но не удаляем позицию
            this.editItem(lineNumber, 'count', 1);
            return;
        }

        // Если значение стало 0 или отрицательным
        if (value <= 0) {
            // Устанавливаем минимальное значение 1
            this.editItem(lineNumber, 'count', 1);
            message.warning('Минимальное количество - 1');
            return;
        }

        // Обычное изменение количества
        this.editItem(lineNumber, 'count', value);
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

            // Перенумеруем оставшиеся строки
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

                    // Если изменяется количество, пересчитываем сумму
                    if (pName === 'count') {
                        updatedItem.total = updatedItem.count * updatedItem.price;
                    }

                    // Если изменяется цена, пересчитываем сумму
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

    handleCountChange = (lineNumber, value) => {
        if (value > 0) {
            this.editItem(lineNumber, 'count', value);
        } else {
            this.removeItem(lineNumber);
        }
    };

    render() {
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
                        min={1}
                        max={999}
                        value={record.count}
                        onChange={(value) => this.handleCountChange(record.lineNumber, value)}
                        onBlur={() => {
                            // При потере фокуса проверяем, что значение не пустое
                            if (!record.count || record.count < 1) {
                                this.editItem(record.lineNumber, 'count', 1);
                            }
                        }}
                        size="small"
                        style={{ width: '60px' }}
                        precision={0}
                        parser={(value) => {
                            // Парсим только целые числа
                            return parseInt(value.replace(/[^\d]/g, '')) || 1;
                        }}
                        formatter={(value) => {
                            // Форматируем без лишних символов
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
                    <Popconfirm
                        title="Удалить позицию?"
                        onConfirm={() => this.removeItem(record.lineNumber)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            type="text"
                        />
                    </Popconfirm>
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
            <div>
                <Table
                    size='small'
                    locale={{
                        emptyText: (
                            <div><Loading3QuartersOutlined spin /> Пусто</div>
                        )
                    }}
                    pagination={{
                        defaultPageSize: 6,
                        showSizeChanger: false,
                        position: ['bottomRight']
                    }}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered
                    rowKey="lineNumber"
                />
            </div>
        );
    }
}

export default _ProductTable;
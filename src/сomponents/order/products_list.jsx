import React from 'react';
import { Table, Typography, InputNumber, Button, Popconfirm, message, Row, Col } from 'antd';
import { Loading3QuartersOutlined, DeleteOutlined } from "@ant-design/icons";
import './products_list.css';

const { Text } = Typography;

class _ProductTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                current: 1,
                pageSize: 5,
            }
        };
    }

    handleCountChange = (lineNumber, value) => {
        if (value === null || value === undefined) {
            window.orderEditItem?.(lineNumber, 'count', 1);
            return;
        }

        if (value <= 0) {
            window.orderEditItem?.(lineNumber, 'count', 1);
            message.warning('Минимальное количество - 1');
            return;
        }

        window.orderEditItem?.(lineNumber, 'count', value);
    };

    handleTableChange = (pagination) => {
        this.setState({ pagination });
    };

    componentDidMount() {
        if (window.orderLoadItems && this.props.dataSource) {
            window.orderLoadItems(this.props.dataSource);
        }
    }

    renderPagination = () => {
        const { pagination } = this.state;
        const { dataSource = [] } = this.props;
        const total = dataSource.length;
        const { current, pageSize } = pagination;

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    size="middle"
                    disabled={current === 1}
                    onClick={() => this.handleTableChange({ current: current - 1, pageSize })}
                >
                    &lt;
                </Button>
                <span style={{ margin: '0 8px' }}>
                    {current} / {Math.ceil(total / pageSize)}
                </span>
                <Button
                    size="middle"
                    disabled={current === Math.ceil(total / pageSize) || total === 0}
                    onClick={() => this.handleTableChange({ current: current + 1, pageSize })}
                >
                    &gt;
                </Button>
            </div>
        );
    };

    render() {
        const { dataSource = [] } = this.props;
        const { pagination } = this.state;

        const columns = [
            {
                title: '№',
                dataIndex: 'lineNumber',
                key: 'lineNumber',
                width: 30,
            },
            {
                title: 'Товары',
                dataIndex: 'product_title',
                key: 'product_title',
                width: 200,
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
                        max={99}
                        value={record.count}
                        onChange={(value) => this.handleCountChange(record.lineNumber, value)}
                        onBlur={() => {
                            if (!record.count || record.count < 1) {
                                window.orderEditItem?.(record.lineNumber, 'count', 1);
                            }
                        }}
                        size="small"
                        style={{ width: '50px' }}
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
                width: 80,
                render: (_, { price }) => (
                    <div style={{ fontSize: '11px' }}>{price} ₽</div>
                )
            },
            {
                title: 'Сумма',
                dataIndex: 'total',
                key: 'total',
                width: 80,
                render: (_, { total, total_with_discount }) => {
                    if (total_with_discount && total_with_discount < total) {
                        return (
                            <div style={{ fontSize: '11px' }}>
                                <div style={{ textDecoration: 'line-through', color: '#999' }}>
                                    {total} ₽
                                </div>
                                <div>
                                    {total_with_discount} ₽
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div style={{ fontSize: '11px' }}>{total} ₽</div>
                    );
                }
            },
            {
                title: '',
                key: 'actions',
                width: 45,
                render: (_, record) => (
                    <div style={{
                        pointerEvents: this.props.disabled ? 'none' : 'auto'
                    }}>
                        <Popconfirm
                            title="Удалить позицию?"
                            onConfirm={() => window.orderRemoveItem?.(record.lineNumber)}
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
            },
            {
                title: 'total_with_discount',
                dataIndex: 'total_with_discount',
                key: 'total_with_discount',
                hidden: true
            }
        ].filter(item => !item.hidden);

        return (
            <div style={{ visibility: this.props.hidden ? 'hidden' : 'visible' }}>
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
                        <Text strong style={{ color: '#595959' }}>СПИСОК ТОВАРОВ</Text>
                    </Col>
                    <Col>
                        {this.renderPagination()}
                    </Col>
                </Row>
                <Table
                    size="small"
                    locale={{
                        emptyText: (
                            <div><Loading3QuartersOutlined spin /> Пусто</div>
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
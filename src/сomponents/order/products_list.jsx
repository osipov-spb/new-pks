import React from 'react';
import { Table, Typography, InputNumber, Button, Popconfirm, message, Row, Col } from 'antd';
import { Loading3QuartersOutlined, DeleteOutlined } from "@ant-design/icons";
import './products_list.css';

const { Text } = Typography;

class _ProductTable extends React.Component {
    constructor(props) {
        super(props);
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

    componentDidMount() {
        if (window.orderLoadItems && this.props.dataSource) {
            window.orderLoadItems(this.props.dataSource);
        }
    }

    render() {
        const { dataSource = [] } = this.props;

        const columns = [
            {
                title: ()=>{
                    return <div style={{
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>№</div>
                },
                dataIndex: 'lineNumber',
                key: 'lineNumber',
                width: 35,
                fixed: 'left',
                render: (_, { lineNumber }) => (
                    <div style={{
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>{lineNumber}</div>
                )
            },
            {
                title: ()=>{
                    return <div style={{
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>Товары</div>
                },
                dataIndex: 'product_title',
                key: 'product_title',
                width: 130,
                render: (_, { product_title }) => (
                    <div style={{
                        fontSize: '10px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>{product_title}</div>
                )
            },
            {
                title: ()=>{
                    return <div style={{
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>Кол-во</div>
                },
                dataIndex: 'count',
                key: 'count',
                width: 55,
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
                        style={{ width: '40px',  fontSize: '11px'}}
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
                title: ()=>{
                    return <div style={{
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>Цена</div>
                },
                dataIndex: 'price',
                key: 'price',
                width: 55,
                render: (_, { price }) => (
                    <div style={{ fontSize: '11px' }}>{price} ₽</div>
                )
            },
            {
                title: ()=>{
                    return <div style={{
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>Сумма</div>
                },
                dataIndex: 'total',
                key: 'total',
                width: 55,
                render: (_, { total, total_with_discount }) => {
                    if (total_with_discount < total) {
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
                width: 42,
                fixed: 'right',
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
            }
        ];

        return (
            <div style={{
                visibility: this.props.hidden ? 'hidden' : 'visible',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
            }}>
                <Row
                    align="middle"
                    justify="space-between"
                    style={{
                        padding: '8px 16px',
                        background: '#f5f5f5',
                        borderBottom: '1px solid #e8e8e8',
                        flexShrink: 0
                    }}
                >
                    <Col>
                        <Text strong style={{ color: '#595959' }}>СПИСОК ТОВАРОВ</Text>
                    </Col>
                </Row>
                <div style={{
                    flex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Table
                        size="small"
                        locale={{
                            emptyText: (
                                <div><Loading3QuartersOutlined spin /> Пусто</div>
                            )
                        }}
                        pagination={false}
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        rowKey="lineNumber"
                        scroll={{
                            y: 'calc(100vh - 400px)'
                        }}
                        style={{
                            flex: 1,
                            overflow: 'hidden',
                            // Скрываем скроллбар полностью
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            },
                            '-ms-overflow-style': 'none',
                            'scrollbar-width': 'none'
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default _ProductTable;
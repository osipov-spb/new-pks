import React from 'react';
import { Table, Typography, InputNumber, Button, Popconfirm, message, Row, Col } from 'antd';
import { Loading3QuartersOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import './products_list.css';

const { Text } = Typography;

class _ProductTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHiddenItems: false
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

    toggleHiddenItems = () => {
        this.setState(prevState => ({
            showHiddenItems: !prevState.showHiddenItems
        }));
    };

    componentDidMount() {
        if (window.orderLoadItems && this.props.dataSource) {
            window.orderLoadItems(this.props.dataSource);
        }
    }

    render() {
        const { dataSource = [] } = this.props;
        const { showHiddenItems } = this.state;

        const filteredDataSource = showHiddenItems
            ? dataSource
            : dataSource.filter(item => !item.hide);

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
                render: (_, { lineNumber, hide }) => (
                    <div style={{
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        opacity: hide ? 0.5 : 1
                    }}>{lineNumber}</div>
                )
            },
            {
                title: () => {
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
                render: (_, { product_title, hide }) => (
                    <div style={{
                        fontSize: '10px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.2',
                        maxHeight: '2.4em', // 2 строки (1.2 * 2)
                        opacity: hide ? 0.5 : 1,
                        wordBreak: 'break-word'
                    }}>
                        {product_title}
                    </div>
                )
            },
            {
                title: () => {
                    return <div style={{
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>Кол-во</div>
                },
                dataIndex: 'count',
                key: 'count',
                width: 70, // Немного увеличил ширину для лучшего отображения
                render: (_, record) => (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                    }}>
                        <Button
                            disabled={this.props.disabled || record.hide}
                            size="small"
                            type="text"
                            style={{
                                width: '20px',
                                height: '20px',
                                minWidth: '20px',
                                padding: 0,
                                lineHeight: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => {
                                const newValue = Math.max(1, (record.count || 1) - 1);
                                this.handleCountChange(record.lineNumber, newValue);
                            }}
                        >
                            -
                        </Button>
                        <div style={{
                            minWidth: '20px',
                            textAlign: 'center',
                            fontSize: '13px',
                            opacity: record.hide ? 0.5 : 1
                        }}>
                            {record.count}
                        </div>
                        <Button
                            disabled={this.props.disabled || record.hide}
                            size="small"
                            type="text"
                            style={{
                                width: '20px',
                                height: '20px',
                                minWidth: '20px',
                                padding: 0,
                                lineHeight: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => {
                                const newValue = Math.min(99, (record.count || 1) + 1);
                                this.handleCountChange(record.lineNumber, newValue);
                            }}
                        >
                            +
                        </Button>
                    </div>
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
                render: (_, { price, hide }) => (
                    <div style={{ fontSize: '11px', opacity: hide ? 0.5 : 1 }}>{price} ₽</div>
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
                render: (_, { total, total_with_discount, hide }) => {
                    const style = { fontSize: '11px', opacity: hide ? 0.5 : 1 };
                    if (total_with_discount < total) {
                        return (
                            <div style={style}>
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
                        <div style={style}>{total} ₽</div>
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
                        pointerEvents: this.props.disabled ? 'none' : 'auto',
                        opacity: record.hide ? 0.5 : 1
                    }}>
                        <Popconfirm
                            title="Удалить позицию?"
                            onConfirm={() => window.orderRemoveItem?.(record.lineNumber)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button
                                disabled={this.props.disabled || record.hide}
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
                    <Col>
                        <Button
                            icon={showHiddenItems ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            size="small"
                            type="text"
                            onClick={this.toggleHiddenItems}
                            title={showHiddenItems ? 'Скрыть элементы' : 'Показать скрытые элементы'}
                        />
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
                        dataSource={filteredDataSource}
                        bordered
                        rowKey="lineNumber"
                        scroll={{
                            y: 'calc(100vh - 420px)'
                        }}
                        style={{
                            flex: 1,
                            overflow: 'hidden',
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            },
                            '-ms-overflow-style': 'none',
                            'scrollbar-width': 'none'
                        }}
                        rowClassName={(record) => record.hide ? 'hidden-row' : ''}
                    />
                </div>
            </div>
        );
    }
}

export default _ProductTable;
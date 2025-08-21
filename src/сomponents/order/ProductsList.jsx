// noinspection JSValidateTypes

import React from 'react';
import {Button, Col, Popconfirm, Row, Space, Table, Typography} from 'antd';
import {
    DeleteOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    Loading3QuartersOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";

const { Text } = Typography;

class ProductTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHiddenItems: false,
            tableHeight: 300
        };
        this.tableRef = React.createRef();
        this.containerRef = React.createRef();
    }

    handleCountChange = (lineNumber, value) => {
        if (value === null || value === undefined) {
            window.orderEditItem?.(lineNumber, 'count', 1);
            return;
        }

        if (value <= 0) {
            window.orderEditItem?.(lineNumber, 'count', 1);
            return;
        }

        window.orderEditItem?.(lineNumber, 'count', value);
    };

    toggleHiddenItems = () => {
        this.setState(prevState => ({
            showHiddenItems: !prevState.showHiddenItems
        }));
    };

    updateTableHeight = () => {
        if (this.containerRef.current) {
            const containerHeight = this.containerRef.current.offsetHeight;
            // Вычитаем высоту заголовка таблицы
            const headerHeight = 78; // Высота заголовка "СОСТАВ ЗАКАЗА"
            const newHeight = Math.max(100, containerHeight - headerHeight - 2);
            this.setState({ tableHeight: newHeight });
        }
    };

    componentDidMount() {
        if (window.orderLoadItems && this.props.dataSource) {
            window.orderLoadItems(this.props.dataSource);
        }

        setTimeout(() => {
            this.updateTableHeight();
        }, 0);

        window.addEventListener('resize', this.updateTableHeight);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.hidden !== this.props.hidden ||
            prevProps.dataSource !== this.props.dataSource ||
            prevProps.availableHeight !== this.props.availableHeight) {
            this.updateTableHeight();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateTableHeight);
    }

    render() {
        const { dataSource = [], availableHeight } = this.props;
        const { showHiddenItems, tableHeight } = this.state;

        const filteredDataSource = showHiddenItems
            ? dataSource
            : dataSource.filter(item => !item.hide);

        const columns = [
            {
                title: ()=>{
                    return <div style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
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
                    }}><Text>{lineNumber}</Text></div>
                )
            },
            {
                title: () => {
                    return <div style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>Товары</div>
                },
                dataIndex: 'product_title',
                key: 'product_title',
                width: 180,
                render: (_, { product_title, hide }) => (
                    <div style={{
                        fontSize: '12px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.2',
                        maxHeight: '2.4em',
                        opacity: hide ? 0.5 : 1,
                        wordBreak: 'break-word'
                    }}>
                        <Text>
                            {product_title}
                        </Text>
                    </div>
                )
            },
            {
                title: () => {
                    return <div style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>Кол-во</div>
                },
                dataIndex: 'count',
                key: 'count',
                width: 70,
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
                            opacity: record.hide ? 0.5 : 1
                        }}>
                            <Text>{record.count}</Text>
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
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>Сумма</div>
                },
                dataIndex: 'total',
                key: 'total',
                width: 55,
                render: (_, { total, total_with_discount, hide }) => {
                    const style = { fontSize: '12px', opacity: hide ? 0.5 : 1 };
                    if (total_with_discount < total) {
                        return (
                            <div style={style}>
                                <div style={{ textDecoration: 'line-through', color: '#999', fontWeight: 'normal'  }}>
                                    <Text>{total} ₽</Text>
                                </div>
                                <div>
                                    <Text>{total_with_discount} ₽</Text>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div style={style}><Text>{total} ₽</Text></div>
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
            <div
                ref={this.containerRef}
                style={{
                    visibility: this.props.hidden ? 'hidden' : 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    height: availableHeight || '100%',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
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
                        <Space size='small'>
                            <UnorderedListOutlined style={{ color: '#1890ff' }} />
                            <Text strong style={{ color: '#595959' }}>СОСТАВ ЗАКАЗА</Text>
                        </Space>
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
                        ref={this.tableRef}
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
                            y: tableHeight,
                            x: '100%'
                        }}
                        style={{
                            flex: 1,
                            overflow: 'hidden',
                        }}
                        bodyStyle={{
                            padding: 0,
                            margin: 0
                        }}
                        rowClassName={(record) => record.hide ? 'hidden-row' : ''}
                    />
                </div>
            </div>
        );
    }
}

export default ProductTable;
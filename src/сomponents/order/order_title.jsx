import React from 'react';
import {Typography, Tag, Space, Alert} from 'antd';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    HourglassOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    CarOutlined,
    ShoppingOutlined,
    MoneyCollectOutlined,
    DeleteOutlined,
    ShopOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

class _OrderTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderNumber: this.props.order_number || ''
        };
    }

    getStatusIcon = (status) => {
        const statusIcons = {
            'Временной': <ClockCircleOutlined style={{ color: '#1890ff' }}/>,
            'Заказан': <HourglassOutlined style={{ color: '#faad14' }}/>,
            'Кухня': <HourglassOutlined style={{ color: '#fa8c16' }}/>,
            'Комплектация': <ShoppingOutlined style={{ color: '#faad14' }}/>,
            'Ожидает': <HourglassOutlined style={{ color: '#faad14' }}/>,
            'В пути': <CarOutlined style={{ color: '#13c2c2' }}/>,
            'Доставлен': <CheckCircleOutlined style={{ color: '#52c41a' }}/>,
            'Деньги сдал': <MoneyCollectOutlined style={{ color: '#52c41a' }}/>,
            'На удаление': <DeleteOutlined style={{ color: '#f5222d' }}/>,
            'Удален': <DeleteOutlined style={{ color: '#ff4d4f' }}/>,
            'Отказ': <CloseCircleOutlined style={{ color: '#f5222d' }}/>,
            'Ожидание оплаты': <HourglassOutlined style={{ color: '#faad14' }}/>,
            'Возврат на ТТ': <CarOutlined style={{ color: '#13c2c2' }}/>,
            'Ожидание оплаты на точке клиентом': <HourglassOutlined style={{ color: '#faad14' }}/>
        };

        return statusIcons[this.cleanStatusText(status)] || <ClockCircleOutlined style={{ color: '#1890ff' }}/>;
    };

    getStatusColor = (status) => {
        const statusColors = {
            'Временной': 'processing',
            'Заказан': 'processing',
            'Кухня': 'processing',
            'Комплектация': 'processing',
            'Ожидает': 'processing',
            'В пути': 'processing',
            'Доставлен': 'success',
            'Деньги сдал': 'success',
            'На удаление': 'error',
            'Удален': 'error',
            'Отказ': 'error',
            'Ожидание оплаты': 'processing',
            'Возврат на ТТ': 'warning',
            'Ожидание оплаты на точке клиентом': 'processing'
        };

        return statusColors[this.cleanStatusText(status)] || 'default';
    };

    cleanStatusText = (status) => {
        if (!status) return '';

        // Регулярное выражение для удаления:
        // ^ - начало строки
        // [\d,]+ - одна или более цифр или запятых
        // \.? - необязательная точка
        // \s* - необязательные пробелы
        let cleaned = status.replace(/^[\d,]+\.?\s*/, '');

        // Дополнительные замены для читаемости
        cleaned = cleaned.replace('ТТ', 'торговую точку');

        return cleaned;
    };

    formatDate = (dateString) => {
        if (!dateString) return 'Нет данных';

        // Если дата уже в нужном формате, просто возвращаем её
        if (typeof dateString === 'string' && dateString.match(/^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}$/)) {
            return dateString;
        }

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;

            // Форматируем дату вручную без учета часового пояса
            const day = date.getUTCDate().toString().padStart(2, '0');
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const year = date.getUTCFullYear();
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');

            return `${day}.${month}.${year}, ${hours}:${minutes}`;
        } catch (e) {
            console.error('Ошибка форматирования даты:', e);
            return dateString;
        }
    };

    render() {
        const { status, date, deleted } = this.props;
        const projectTitle = this.props.project?.title; // Получаем название фирмы

        return (
            <>
                {deleted && (
                    <Alert
                        message="Заказ удален"
                        type="error"
                        showIcon
                        style={{
                            margin: '-8px -16px 8px -16px',
                            borderRadius: 0,
                            borderLeft: 0,
                            borderRight: 0
                        }}
                    />
                )}
                <div style={{
                    padding: '8px 16px',
                    margin: deleted ? '0 -16px 8px -16px' : '-8px -16px 8px -16px',
                    background: '#f0f9ff',
                    borderBottom: '1px solid #d9eef7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '40px'
                }}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{
                            width: '4px',
                            height: '20px',
                            background: '#1890ff',
                            marginRight: '12px',
                            borderRadius: '2px',
                            flexShrink: 0
                        }}></div>

                        <Title
                            level={4}
                            style={{
                                margin: 0,
                                color: '#1890ff',
                                fontWeight: 600,
                                fontSize: '16px',
                                lineHeight: '24px',
                                marginRight: '12px' // Добавляем отступ перед ярлыком
                            }}
                        >
                            {this.state.orderNumber ? `Заказ №${this.state.orderNumber}` : 'Новый заказ'}
                        </Title>

                        {/* Ярлык с названием фирмы */}
                        {projectTitle && (
                            <Tag
                                icon={<ShopOutlined/>}
                                color="geekblue"
                                style={{
                                    // borderRadius: '4px',
                                    padding: '0 10px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '12px',
                                    fontWeight: 500
                                }}
                            >
                                {projectTitle}
                            </Tag>
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <Space direction={"horizontal"} size={"middle"}>
                            {status && (
                                <Tag
                                    icon={this.getStatusIcon(status)}
                                    color={this.getStatusColor(status)}
                                    style={{
                                        margin: 0,
                                        padding: '2px 8px',
                                        // borderRadius: '4px',
                                        fontWeight: 500,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {this.cleanStatusText(status)}
                                </Tag>
                            )}

                            {date && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: '#595959',
                                    fontSize: '14px'
                                }}>
                                    <Space direction={"horizontal"} size={"small"}>
                                        <CalendarOutlined/>
                                        <Text type="secondary">
                                            {this.formatDate(date)}
                                        </Text>
                                    </Space>
                                </div>
                            )}
                        </Space>
                    </div>
                </div>
            </>
        );
    }
}

export default _OrderTitle;
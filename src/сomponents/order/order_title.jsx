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
    ShopOutlined, CheckOutlined
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
            'Временной': <ClockCircleOutlined style={{ color: '#d48806' }}/>,
            'Заказан': <HourglassOutlined style={{ color: '#c41d7f' }}/>,
            'Кухня': <HourglassOutlined style={{ color: '#d4380d' }}/>,
            'Комплектация': <ShoppingOutlined style={{ color: '#fa541c' }}/>,
            'Ожидает': <HourglassOutlined style={{ color: '#096dd9' }}/>,
            'В пути': <CarOutlined style={{ color: '#d48806' }}/>,
            'Доставлен': <CheckCircleOutlined style={{ color: '#52c41a' }}/>,
            'Деньги сдал': <CheckOutlined style={{ color: '#52c41a' }}/>,
            'На удаление': <DeleteOutlined style={{ color: '#f5222d' }}/>,
            'Удален': <DeleteOutlined style={{ color: '#ff4d4f' }}/>,
            'Отказ': <CloseCircleOutlined style={{ color: '#f5222d' }}/>,
            'Ожидание оплаты': <HourglassOutlined style={{ color: '#08979c' }}/>,
            'Возврат на ТТ': <CarOutlined style={{ color: '#d48806' }}/>,
            'Ожидание оплаты на точке клиентом': <HourglassOutlined style={{ color: '#08979c' }}/>
        };

        return statusIcons[this.cleanStatusText(status)] || <ClockCircleOutlined style={{ color: '#1890ff' }}/>;
    };

    getStatusColor = (status) => {
        const statusColors = {
            'Временной': '#FFEED8',
            'Заказан': '#F4E1FB',
            'Кухня': '#FBDBD7',
            'Комплектация': '#FFF0EF',
            'Ожидает': '#DBF4FB',
            'В пути': '#FFFAC5',
            'Доставлен': '#EEFCF1',
            'Деньги сдал': '#D2F0D3',
            'На удаление': '#F3E1D0',
            'Удален': '#F3E1D0',
            'Отказ': '#F3E1D0',
            'Ожидание оплаты': '#e6fffb',
            'Возврат на ТТ': '#F3E1D0',
            'Ожидание оплаты на точке клиентом': '#e6fffb'
        };

        return statusColors[this.cleanStatusText(status)] || 'default';
    };

    getIconColor = (status) => {
        const statusIconColors = {
            'Временной': '#ffc069',
            'Заказан': '#ffadd2',
            'Кухня': '#ffbb96',
            'Комплектация': '#ffbb96',
            'Ожидает': '#91d5ff',
            'В пути': '#ffd666',
            'Доставлен': '#95de64',
            'Деньги сдал': '#a0d911',
            'На удаление': '#ffa39e',
            'Удален': '#ffa39e',
            'Отказ': '#ffa39e',
            'Ожидание оплаты': '#87e8de',
            'Возврат на ТТ': '#ffbb96',
            'Ожидание оплаты на точке клиентом': '#87e8de'
        };

        return statusIconColors[this.cleanStatusText(status)] || '#1890ff';
    };

    cleanStatusText = (status) => {
        if (!status) return '';

        // Удаляем все цифры, точки и запятые в начале строки, включая пробелы после них
        let cleaned = status.replace(/^[\d.,]+\s*/, '');

        // Дополнительные замены для читаемости
        // cleaned = cleaned.replace('ТТ', 'торговую точку');

        return cleaned.trim(); // Удаляем возможные пробелы в начале/конце
    };

    formatDate = (dateString) => {
        if (!dateString) return 'Нет данных';

        if (typeof dateString === 'string' && dateString.match(/^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}$/)) {
            return dateString;
        }

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;

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
        const projectTitle = this.props.project?.title;

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
                        <Title
                            level={4}
                            style={{
                                margin: 0,
                                marginLeft: '10px',
                                color: '#1890ff',
                                fontWeight: 600,
                                fontSize: '16px',
                                lineHeight: '24px',
                                marginRight: '12px'
                            }}
                        >
                            <Space size='small'>
                                <ShoppingOutlined />
                                {this.state.orderNumber ? `Заказ ${this.state.orderNumber}` : 'Новый заказ'}
                            </Space>
                        </Title>

                        {projectTitle && (
                            <Tag
                                icon={<ShopOutlined/>}
                                color="geekblue"
                                style={{
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
                                        border: `1px solid ${this.getIconColor(status)}`,
                                        borderRadius: '4px',
                                        fontWeight: 500,
                                        color: "#000000",
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
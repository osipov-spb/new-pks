import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

class _OrderTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderNumber: this.props.order_number || ''
        };
    }

    render() {
        return (
            <div style={{
                padding: '8px 16px', // Уменьшили вертикальный padding
                margin: '-8px -16px 8px -16px', // Соответственно уменьшили margin
                background: '#f0f9ff',
                borderBottom: '1px solid #d9eef7',
                display: 'flex',
                alignItems: 'center', // Точное вертикальное выравнивание
                height: '40px' // Фиксированная высота
            }}>
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
                        fontSize: '16px', // Слегка уменьшили размер
                        lineHeight: '24px' // Фиксированный line-height
                    }}
                >
                    {this.state.orderNumber ? `Заказ №${this.state.orderNumber}` : 'Новый заказ'}
                </Title>
            </div>
        );
    }
}

export default _OrderTitle;
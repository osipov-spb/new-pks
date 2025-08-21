// noinspection JSCheckFunctionSignatures

import React, {useEffect, useState} from 'react';
import {Progress, Space, Typography, Card} from 'antd';
import {FallOutlined, RiseOutlined, TrophyOutlined, CrownOutlined} from '@ant-design/icons';

const { Text } = Typography;

const metrics = [
    {
        key: 'plan',
        label: 'Выполнение плана',
        render: (state) => (
            <div style={{ width: '100%' }}>
                <Progress
                    percent={state.planCompletion}
                    size="small"
                    strokeColor={{
                        '0%': '#1890ff',
                        '100%': '#52c41a',
                    }}
                    trailColor="#f0f0f0"
                    showInfo={true}
                    format={(percent) => `${percent}%`}
                    style={{
                        margin: 0,
                        fontSize: '12px'
                    }}
                />
            </div>
        )
    },
    {
        key: 'place',
        label: 'Ваше место',
        render: (state) => (
            <Space>
                <CrownOutlined style={{
                    fontSize: 20,
                    color: state.place <= 3 ? '#faad14' : '#8c8c8c',
                    background: state.place <= 3 ? 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)' : 'transparent',
                    padding: '4px',
                    borderRadius: '50%'
                }} />
                <Text strong style={{
                    fontSize: '16px',
                    color: state.place <= 3 ? '#faad14' : '#262626'
                }}>
                    #{state.place || '—'}
                </Text>
            </Space>
        )
    },
    {
        key: 'trend',
        label: 'Тенденция',
        render: (state) => {
            const isPositive = state.trend > 0;
            const Icon = isPositive
                ? <RiseOutlined style={{
                    color: '#52c41a',
                    fontSize: 20,
                    background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
                    padding: '4px',
                    borderRadius: '6px'
                }} />
                : <FallOutlined style={{
                    color: '#ff4d4f',
                    fontSize: 20,
                    background: 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)',
                    padding: '4px',
                    borderRadius: '6px'
                }} />;

            return (
                <Space>
                    {Icon}
                    <Text strong style={{
                        fontSize: '16px',
                        color: isPositive ? '#52c41a' : '#ff4d4f'
                    }}>
                        {Math.abs(state.trend)}%
                    </Text>
                </Space>
            );
        }
    }
];

const Motivation = () => {
    const [state, setState] = useState({
        planCompletion: 0,
        leader: "",
        place: 0,
        trend: 0,
        activeMetric: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setState(prev => ({
                ...prev,
                activeMetric: (prev.activeMetric + 1) % metrics.length
            }));
        }, 5000);

        window.motivation_SetData = (planCompletion, leader, place, trend) => {
            setState({
                planCompletion,
                leader,
                place,
                trend,
                activeMetric: 0
            });
            return true;
        };

        window.motivation_SetData(50, "Т01, Тестовая", 1, 80);

        return () => clearInterval(interval);
    }, []);

    const currentMetric = metrics[state.activeMetric];

    return (
        <div style={{
            height: '90px',
            minWidth: '190px',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        }}
             onMouseEnter={(e) => {
                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
                 e.currentTarget.style.transform = 'translateY(-1px)';
             }}
             onMouseLeave={(e) => {
                 e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                 e.currentTarget.style.transform = 'translateY(0)';
             }}
        >
            <div style={{
                width: '100%',
                textAlign: 'center'
            }}>
                <Text type="secondary" style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#8c8c8c',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                    display: 'block',
                    marginBottom: '8px'
                }}>
                    {currentMetric.label}
                </Text>
            </div>

            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '32px'
            }}>
                {currentMetric.render(state)}
            </div>

            {/* Индикатор текущей метрики */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '4px',
                marginTop: '4px'
            }}>
                {metrics.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: index === state.activeMetric ? '#1890ff' : '#d9d9d9',
                            transition: 'background 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Motivation;
// noinspection JSCheckFunctionSignatures

import React, {useEffect, useState} from 'react';
import {Progress, Space, Typography} from 'antd';
import {FallOutlined, RiseOutlined, TrophyOutlined} from '@ant-design/icons';

const { Text } = Typography;

const metrics = [
    {
        key: 'plan',
        label: 'Выполнение плана',
        render: (state) => (
            <Space>
            <Progress
                steps={7}
                percent={state.planCompletion}
            />
            </Space>
        )
    },
    {
        key: 'place',
        label: 'Ваше место',
        render: (state) => (
            <Space>
                <TrophyOutlined style={{ fontSize: 20 }} />
                <Text strong>#{state.place || '—'}</Text>
            </Space>
        )
    },
    {
        key: 'trend',
        label: 'Тенденция',
        render: (state) => {
            const Icon = state.trend > 0
                ? <RiseOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                : <FallOutlined style={{ color: '#f5222d', fontSize: 20 }} />;

            return (
                <Space>
                    {Icon}
                    <Text strong>{Math.abs(state.trend)}%</Text>
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
            height: '100%', // Занимает всю доступную высоту
            minHeight: '90px', // Минимальная высота как у кнопок
            minWidth: '190px',
            background: '#fff',
            borderRadius: 6,
            padding: '0 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end', // Выравнивание по нижнему краю
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center',
            marginBottom: 0 // Убираем возможный отступ снизу
        }}>
            <div style={{
                marginBottom: '14px', // Отступ от нижнего края
                width: '100%'
            }}>
                <Text type="secondary" style={{
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block'
                }}>
                    {currentMetric.label}
                </Text>
            </div>

            <div style={{
                marginBottom: '17px', // Отступ от нижнего края
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {currentMetric.render(state)}
            </div>
        </div>
    );
};

export default Motivation;
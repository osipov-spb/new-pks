import { Button, Col, Row, Space, Typography, Modal } from "antd";
import {
    ClockCircleOutlined,
    CompassOutlined,
    FieldTimeOutlined,
    FilterOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    StopOutlined
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import _FunctionsButton from "./buttons/functions";
import Motivation from "./motivation/motivation";
import _Header from "./header";

const { Text } = Typography;

const _Menu = ({ projects = [] }) => {
    const [size, setSize] = useState('large');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState(new Date()); // Состояние для текущей даты и времени

    // Эффект для обновления времени каждую минуту
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000); // Обновляем каждую минуту

        return () => clearInterval(timer); // Очистка интервала при размонтировании
    }, []);

    // Функция для форматирования даты и времени
    const formatTime = (date) => {
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            weekday: 'short'
        }).replace(',', '').replace('г.', '');
    };

    const showProjectModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const createOrderOnClick = () => {
        if (projects.length <= 1) {
            // window.show_page('order')
        } else {
            showProjectModal();
        }
    };

    return (
        <>
            <Row align="middle" gutter={16} style={{ marginBottom: 16 }}>
                <Col span={18}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <_Header />
                        <Space size="small" wrap>
                            {projects.length == 1 ? (
                                <Button
                                    type="primary"
                                    onClick={createOrderOnClick}
                                    href="#"
                                    data-button-id={`menu-create-order-project-${projects[0].id}`}
                                    icon={<PlusOutlined/>}
                                    size={size}
                                >
                                    Создать заказ
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    onClick={createOrderOnClick}
                                    icon={<PlusOutlined/>}
                                    size={size}
                                >
                                    Создать заказ
                                </Button>
                            )}

                            <_FunctionsButton/>
                            <Button href="#" data-button-id="menu-info" icon={<InfoCircleOutlined/>} size={size}>
                                Табло
                            </Button>
                            <Button href="#" data-button-id="menu-maps" icon={<CompassOutlined/>} size={size}>
                                Карта
                            </Button>
                            <Button href="#" data-button-id="menu-stop" icon={<StopOutlined/>} size={size} danger>
                                Стоп
                            </Button>
                        </Space>
                    </Space>
                </Col>
                <Col span={6}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        height: '90px',
                        width: '100%'
                    }}>
                        {/* Стильный блок даты/времени */}
                        <div style={{
                            marginRight: '16px', // Аналог gap для старых браузеров
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end', // Выравнивание по нижнему краю
                            alignItems: 'flex-end',
                            // paddingBottom: '8px', // Отступ снизу для визуального баланса
                            minWidth: '90px',
                            borderRadius: 8,
                            textAlign: 'right'
                        }}>
                            <div style={{
                                fontSize: '24px',
                                fontWeight: 500,
                                color: '#1890ff',
                                lineHeight: 1,
                                marginBottom: '4px',
                                display: 'flex',
                                alignItems: 'flex-end'
                            }}>
                                {formatTime(currentDateTime)}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: '#666',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {formatDate(currentDateTime)}
                            </div>
                        </div>
                        <a href='#' data-button-id='menu-functions-staff-motivation'>
                            <Motivation/>
                        </a>
                    </div>
                </Col>
            </Row>

            {/* Блок с текущей датой и временем */}

            {/* Модальное окно выбора проекта */}
            <Modal
                title="Выберите проект"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Отмена
                    </Button>
                ]}
            >
                <Space direction="vertical" style={{width: '100%'}}>
                    {projects.map(project => (
                        <Button
                            key={project.id}
                            block
                            style={{textAlign: 'left'}}
                            href="#"
                            data-button-id={`menu-create-order-project-${project.id}`}
                        >
                            {project.title}
                        </Button>
                    ))}
                </Space>
            </Modal>
        </>
    )
}

export default _Menu;
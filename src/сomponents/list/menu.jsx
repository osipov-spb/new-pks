import {Button, Col, Row, Space, Typography, Modal} from "antd";
import {
    CompassOutlined,
    FilterOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    StopOutlined
} from "@ant-design/icons";
import React, {useState} from "react";
import _FunctionsButton from "./buttons/functions";
import Motivation from "./motivation/motivation";
import _Header from "./header";

const {Text} = Typography;

const _Menu = ({ projects = [] }) => { // Добавляем пропс projects
    const [size, setSize] = useState('large');
    const [isModalVisible, setIsModalVisible] = useState(false);

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
            <Row align="bottom">
                <Col span={18}>
                    <Space direction="vertical" size="large">
                        <_Header/>
                        <Space size="small">
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

                            <Button icon={<FilterOutlined/>} size={size}/>
                            <_FunctionsButton/>
                            <Button href="#" data-button-id="menu-info" icon={<InfoCircleOutlined/>} size={size}>
                                Инфо
                            </Button>
                            <Button href="#" data-button-id="menu-maps" icon={<CompassOutlined/>} size={size}>
                                Карты
                            </Button>
                            <Button href="#" data-button-id="menu-stop" icon={<StopOutlined/>} size={size} danger>
                                Стоп
                            </Button>
                        </Space>
                    </Space>
                </Col>
                <Col span={6}>
                    <Motivation/>
                </Col>
            </Row>

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
                <Space direction="vertical" style={{ width: '100%' }}>
                    {projects.map(project => (
                        <Button
                            key={project.id}
                            block
                            style={{ textAlign: 'left' }}
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
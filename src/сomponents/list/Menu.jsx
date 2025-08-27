import React from 'react';
import {Button, Col, Modal, Row, Space} from "antd";
import {CompassOutlined, InfoCircleOutlined, PlusOutlined, StopOutlined} from "@ant-design/icons";
import _FunctionsButton from "./buttons/Functions";
import Motivation from "./motivation/motivation";
import TableHeader from "./Header";

class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 'large',
            isModalOpen: false,
            isStopActive: false
        };
    }

    componentDidMount() {
        // Добавляем функцию в window для внешнего доступа
        window.setStopButtonState = (isActive) => {
            this.setState({ isStopActive: isActive });
            return true;
        };
    }

    showProjectModal = () => {
        this.setState({ isModalOpen: true });
    };

    handleCancel = () => {
        this.setState({ isModalOpen: false });
    };

    createOrderOnClick = () => {
        if (this.props.projects.length <= 1) {
            // window.show_page('order')
        } else {
            this.showProjectModal();
        }
    };

    render() {
        const { projects = [] } = this.props;
        const { size, isModalOpen, isStopActive } = this.state;

        return (
            <>
                <Row align="middle" gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={18}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <TableHeader />
                            <Space size="small" wrap>
                                {projects.length === 1 ? (
                                    <Button
                                        type="primary"
                                        onClick={this.createOrderOnClick}
                                        href="#"
                                        data-button-id={`menu-create-order-project-${projects[0].id}`}
                                        icon={<PlusOutlined/>}
                                        size={size}
                                        style={{
                                            borderRadius: '8px',
                                            border: '1px solid #d9d9d9'
                                        }}
                                    >
                                        Создать заказ
                                    </Button>
                                ) : (
                                    <Button
                                        type="primary"
                                        onClick={this.createOrderOnClick}
                                        icon={<PlusOutlined/>}
                                        size={size}
                                        style={{
                                            borderRadius: '8px',
                                            border: '1px solid #d9d9d9'
                                        }}
                                    >
                                        Создать заказ
                                    </Button>
                                )}

                                <_FunctionsButton/>
                                <Button href="#"
                                        data-button-id="menu-info"
                                        icon={<InfoCircleOutlined/>}
                                        size={size}
                                        style={{
                                            borderRadius: '8px',
                                            border: '1px solid #d9d9d9'
                                        }}>
                                    Табло
                                </Button>
                                <Button href="#"
                                        data-button-id="menu-maps"
                                        icon={<CompassOutlined/>}
                                        size={size}
                                        style={{
                                            borderRadius: '8px',
                                            border: '1px solid #d9d9d9'
                                        }}>
                                    Карта
                                </Button>
                                <Button href="#"
                                        data-button-id="menu-stop"
                                        icon={<StopOutlined/>}
                                        size={size}
                                        type={isStopActive ? "primary" : "default"}
                                        danger={isStopActive}
                                        style={{
                                            borderRadius: '8px',
                                            border: '1px solid #d9d9d9',
                                            backgroundColor: isStopActive ? '#ff4d4f' : 'transparent'
                                        }}>
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
                            <a href='#' data-button-id='menu-functions-staff-motivation'>
                                <Motivation/>
                            </a>
                        </div>
                    </Col>
                </Row>

                {/* Модальное окно выбора проекта */}
                <Modal
                    title="Выберите проект"
                    open={isModalOpen}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="cancel" onClick={this.handleCancel}>
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
        );
    }
}

export default MainMenu;
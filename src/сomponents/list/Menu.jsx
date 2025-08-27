import React from 'react';
import {Button, Col, Modal, Row, Space, Dropdown, Menu} from "antd";
import {CompassOutlined, InfoCircleOutlined, PlusOutlined, StopOutlined, SwapOutlined} from "@ant-design/icons";
import _FunctionsButton from "./buttons/Functions";
import Motivation from "./motivation/motivation";
import TableHeader from "./Header";

class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 'large',
            isModalOpen: false,
            isStopActive: false,
            windows: [] // список открытых окон
        };
    }

    componentDidMount() {
        // Добавляем функцию в window для внешнего доступа
        window.setStopButtonState = (isActive) => {
            this.setState({ isStopActive: isActive });
            return true;
        };

        // Функция для обновления списка окон через JSON строку
        window.updateWindowsList = (windowsJson) => {
            try {
                const windows = JSON.parse(windowsJson);
                this.setState({ windows });
            } catch (error) {
                console.error('Ошибка парсинга JSON:', error);
                this.setState({ windows: [] });
            }
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

    // Создание меню для выпадающего списка окон
    getWindowsMenu = () => {
        const { windows } = this.state;

        const menuItems = windows.map(window => ({
            key: window.id || window.name,
            label: (
                <a
                    href="#"
                    data-button-id={`switch-to-window-${window.name || window.id}`}
                    onClick={(e) => e.preventDefault()} // Предотвращаем переход по ссылке
                >
                    {window.title || window.name || `Окно ${window.id}`}
                </a>
            )
        }));

        return <Menu items={menuItems} />;
    };

    // Функция для загрузки списка окон (будет вызываться при клике)
    loadWindowsList = () => {
        // Вызываем внешнюю функцию для получения списка окон в формате JSON
        if (window.getOpenWindows) {
            const windowsJson = window.getOpenWindows();
            try {
                const windows = JSON.parse(windowsJson);
                this.setState({ windows });
            } catch (error) {
                console.error('Ошибка парсинга JSON из getOpenWindows:', error);
                this.setState({ windows: [] });
            }
        } else {
            console.warn('Функция getOpenWindows не определена в window');
        }
    };

    render() {
        const { projects = [] } = this.props;
        const { size, isModalOpen, isStopActive, windows } = this.state;

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
                            {/* Кнопка переключения окон */}
                            <Dropdown
                                overlay={this.getWindowsMenu()}
                                trigger={['click']}
                                onOpenChange={(open) => {
                                    if (open) {
                                        this.loadWindowsList();
                                    }
                                }}
                            >
                                <Button
                                    href="#"
                                    data-button-id="menu-window-switch"
                                    icon={<SwapOutlined />}
                                    size={size}
                                    style={{
                                        borderRadius: '8px',
                                        border: '1px solid #d9d9d9',
                                        marginTop: '50px',
                                        marginRight: '8px'
                                    }}
                                >
                                    Окна
                                </Button>
                            </Dropdown>
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
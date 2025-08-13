import React from "react";
import { notification } from "antd";
import OrdersList from "./list/orders_list";
import Order from "./order/order";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page_type: "list",
            projects: []
        };
        this.notificationCount = 0; // Счетчик для уникальных ключей уведомлений
    }

    componentDidMount() {
        this.setupWindowMethods();
        this.updateTableHeight();
        this.debounceTimer = null;
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        // Очищаем методы window при размонтировании
        delete window.setAvailableProjects;
        delete window.test_app;
        delete window.show_page;
        delete window.current_page;
        delete window.open_order;
        delete window.showAlert;
        notification.destroy(); // Очищаем все уведомления при размонтировании
    }

    handleResize = () => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.updateTableHeight();
        }, 100);
    }

    updateTableHeight = () => {
        const height = window.innerHeight - 165;
        this.setState({ tableHeight: Math.max(height, 300) });
    }

    setupWindowMethods = () => {
        window.test_app = this.handleTestApp;
        window.show_page = this.handleShowPage;
        window.current_page = this.getCurrentPage;
        window.open_order = this.handleOpenOrder;
        window.setAvailableProjects = this.handleSetProjects;
        window.showAlert = this.handleShowAlert; // Добавляем метод для показа уведомлений
    };

    // Метод для показа уведомления
    handleShowAlert = (message, duration = 30, type = 'info') => {
        this.notificationCount += 1;
        notification[type]({
            message: message,
            key: `alert-${this.notificationCount}`,
            duration: duration, // Уведомление автоматически закроется через 5 секунд
            placement: 'bottomRight',
            style: {
                marginTop: 50 // Отступ сверху
            }
        });
    };

    handleSetProjects = (projectsJson) => {
        try {
            const projects = JSON.parse(projectsJson);

            if (Array.isArray(projects) &&
                projects.every(p => p.id && p.title)) {
                this.setState({ projects });
            } else {
                console.error("Invalid projects format. Expected array of {id, title}");
                // this.handleShowAlert("Invalid projects format", 'error');
            }
        } catch (error) {
            console.error("Error parsing projects:", error);
            // this.handleShowAlert("Error parsing projects", 'error');
        }
    };

    handleShowPage = (page_type, order_number) => {
        this.setState({
            page_type,
            order_number
        });
    };

    getCurrentPage = () => {
        return this.state.page_type;
    };

    handleOpenOrder = (order_data, additionalParams) => {
        this.setState({
            page_type: "order",
            order_data,
            additionalParams
        });

        try {
            const parsedItems = JSON.parse(order_data).items;
            window.orderProductListLoadItems(parsedItems);
        } catch (error) {
            console.error("Error parsing order data:", error);
            // this.handleShowAlert("Error parsing order data", 'error');
        }
    };

    renderPageContent() {
        const { page_type, order_data, additionalParams, projects } = this.state;

        switch (page_type) {
            case "order":
                return (
                    <Order
                        order_str={order_data}
                        additionalParams={additionalParams}
                    />
                );
            case "list":
            default:
                return <OrdersList projects={projects} />;
        }
    }

    render() {
        return (
            <>
                {this.renderPageContent()}
            </>
        );
    }
}

export default Main;
import React from "react";
import OrdersList from "./list/orders_list";
import Order from "./order/order";
import Alert from "./common/alert";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page_type: "list",
            projects: [] // Добавляем хранение списка проектов
        };
    }

    componentDidMount() {
        this.setupWindowMethods();
    }

    componentWillUnmount() {
        // Очищаем методы window при размонтировании
        delete window.setAvailableProjects;
        delete window.test_app;
        delete window.show_page;
        delete window.current_page;
        delete window.open_order;
    }

    setupWindowMethods = () => {
        window.test_app = this.handleTestApp;
        window.show_page = this.handleShowPage;
        window.current_page = this.getCurrentPage;
        window.open_order = this.handleOpenOrder;

        // Добавляем новую внешнюю функцию
        window.setAvailableProjects = this.handleSetProjects;
    };

    // Новая функция для сохранения проектов
    handleSetProjects = (projectsJson) => {
        try {
            const projects = JSON.parse(projectsJson);

            // Проверяем структуру проектов
            if (Array.isArray(projects) &&
                projects.every(p => p.id && p.title)) {
                this.setState({ projects });
            } else {
                console.error("Invalid projects format. Expected array of {id, title}");
            }
        } catch (error) {
            console.error("Error parsing projects:", error);
        }
    };

    handleTestApp = () => {
        alert("123");
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
                return <OrdersList projects={projects} />; // Передаем projects
        }
    }

    render() {
        return (
            <>
                {this.renderPageContent()}
                <Alert />

                {/* Скрытый элемент для отладки */}
                <div style={{ display: 'none' }}>
                    Loaded projects: {this.state.projects.length}
                </div>
            </>
        );
    }
}

export default Main;
import React from "react";
import { Button, Tag, Row, Col, Space, Modal } from 'antd';
import { PercentageOutlined } from "@ant-design/icons";
import PaymentForm from "../payment/paymentForm";
import ClientSelectForm from "../clientSelector/clientSelector";

class StatusButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirmModalVisible: false
        }
    }

    showConfirmModal = () => {
        this.setState({ isConfirmModalVisible: true });
    };

    handleConfirmClose = () => {
        // Действие при подтверждении закрытия
        //window.show_page('list');
        this.setState({ isConfirmModalVisible: false });
    };

    handleCancelClose = () => {
        // Действие при отмене закрытия
        this.setState({ isConfirmModalVisible: false });
    };

    render() {
        return (
            <div>
                <Space direction={"horizontal"} size={"small"}>
                    <Button
                        key='close-order-button'
                        onClick={this.showConfirmModal}
                        type="primary"
                        danger
                        style={{
                            minWidth: '120px',
                            minHeight: '40px'
                        }}
                    >
                        Закрыть
                    </Button>

                    <PaymentForm />

                    <Button
                        key='save-order-button'
                        href="#"
                        data-button-id="save-order"
                        style={{
                            minWidth: '120px',
                            minHeight: '40px'
                        }}
                    >
                        Далее
                    </Button>
                </Space>

                {/* Модальное окно подтверждения */}
                <Modal
                    title="Подтверждение действия"
                    visible={this.state.isConfirmModalVisible}
                    onOk={this.handleConfirmClose}
                    onCancel={this.handleCancelClose}
                    footer={[
                        <Button key="back" onClick={this.handleCancelClose}>
                            Нет
                        </Button>,
                        <Button href="#"
                                data-button-id="order-back"
                                key="submit"
                                type="primary"
                                danger
                                onClick={this.handleConfirmClose}>
                            Да
                        </Button>,
                    ]}
                >
                    <p>Вы действительно хотите прервать оформление заказа?</p>
                </Modal>
            </div>
        )
    };
}

export default StatusButtons;
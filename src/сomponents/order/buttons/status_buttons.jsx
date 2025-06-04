import React from "react";
import { Button, Space, Modal } from 'antd';
import {
    CloseOutlined,
    ArrowRightOutlined,
    PrinterOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import PaymentForm from "../payment/paymentForm";

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
        this.setState({ isConfirmModalVisible: false });
    };

    handleCancelClose = () => {
        this.setState({ isConfirmModalVisible: false });
    };

    render() {
        const { order_data } = this.props;
        const showPrintButton = order_data && order_data.order_number;

        return (
            <div>
                <Space direction={"horizontal"} size={"small"} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    {showPrintButton && (
                        <Button
                            icon={<PrinterOutlined />}
                            href="#"
                            data-button-id="order-print"
                            style={{
                                minWidth: '120px',
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}
                        >
                            Печать
                        </Button>
                    )}

                    {!showPrintButton && <div style={{ minWidth: '120px' }}></div>}

                    <Space direction={"horizontal"} size={"small"}>
                        <Button
                            key='close-order-button'
                            onClick={this.showConfirmModal}
                            type="primary"
                            danger
                            icon={<CloseOutlined />}
                            style={{
                                minWidth: '120px',
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            Далее
                            {<ArrowRightOutlined />}
                        </Button>
                    </Space>
                </Space>

                <Modal
                    title="Подтверждение действия"
                    visible={this.state.isConfirmModalVisible}
                    onOk={this.handleConfirmClose}
                    onCancel={this.handleCancelClose}
                    footer={[
                        <Button key="back" onClick={this.handleCancelClose}>
                            Нет
                        </Button>,
                        <Button
                            href="#"
                            data-button-id="order-back"
                            key="submit"
                            type="primary"
                            danger
                            onClick={this.handleConfirmClose}
                        >
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
import React from "react";
import { Button, Space, Modal } from 'antd';
import {
    CloseOutlined,
    ArrowRightOutlined,
    PrinterOutlined
} from '@ant-design/icons';
import PaymentForm from "../payment/paymentForm";
import { isEqual } from 'lodash';

class StatusButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirmModalVisible: false,
            initialOrderData: props.order_data ? { ...props.order_data } : null
        };
    }

    showConfirmModal = () => {
        const { order_data } = this.props;
        const { initialOrderData } = this.state;

        const hasChanges = !isEqual(order_data, initialOrderData);

        if (hasChanges) {
            this.setState({ isConfirmModalVisible: true });
        } else {
            // Если изменений не было, сразу выполняем действие закрытия
            window.location.href = "#";
            if (typeof this.props.onClose === 'function') {
                this.props.onClose();
            }
        }
    };

    handleConfirmClose = () => {
        // Выполняем действие закрытия
        window.location.href = "#";
        if (typeof this.props.onClose === 'function') {
            this.props.onClose();
        }
        this.setState({ isConfirmModalVisible: false });
    };

    handleCancelClose = () => {
        this.setState({ isConfirmModalVisible: false });
    };

    render() {
        const { order_data } = this.props;
        const { isConfirmModalVisible, initialOrderData } = this.state;
        const hasChanges = !isEqual(order_data, initialOrderData);

        return (
            <div>
                <Space direction={"horizontal"} size={"small"} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Button
                        icon={<PrinterOutlined />}
                        href="#"
                        {...(!this.props.printDisabled && { "data-button-id": "order-print" })}
                        disabled={this.props.printDisabed}
                        style={{
                            minWidth: '120px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            visibility: this.props.printHidden ? 'hidden' : 'visible',
                        }}
                    >
                        Печать
                    </Button>

                    <Space direction={"horizontal"} size={"small"}>
                        {hasChanges ? (
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
                        ) : (
                            <Button
                                key='close-order-button'
                                href="#"
                                data-button-id="order-back"
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
                        )}

                        <div style={{
                            pointerEvents: this.props.payDisabed ? 'none' : 'auto',
                            opacity: this.props.payDisabed ? 0.5 : 1,
                            cursor: this.props.payDisabed ? 'not-allowed' : 'default',
                            visibility: this.props.payHidden ? 'hidden' : 'visible',
                        }}>
                            <PaymentForm/>
                        </div>
                        <Button
                            key='save-order-button'
                            href="#"
                            {...(!this.props.nextDisabed && { "data-button-id": "order-proceed" })}
                            disabled={this.props.nextDisabed}
                            style={{
                                minWidth: '120px',
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                visibility: this.props.nextHidden ? 'hidden' : 'visible',
                            }}
                        >
                            Далее
                            {<ArrowRightOutlined />}
                        </Button>
                    </Space>
                </Space>

                <Modal
                    title="Подтверждение действия"
                    visible={isConfirmModalVisible}
                    onCancel={this.handleCancelClose}
                    footer={[
                        <Button key="back" onClick={this.handleCancelClose}>
                            Нет
                        </Button>,
                        <Button
                            href="#"
                            data-button-id="order-back-confirm"
                            key="submit"
                            type="primary"
                            danger
                        >
                            Да
                        </Button>,
                    ]}
                >
                    <p>Вы действительно хотите прервать оформление заказа?</p>
                    <p>Все несохраненные изменения будут потеряны.</p>
                </Modal>
            </div>
        )
    };
}

export default StatusButtons;
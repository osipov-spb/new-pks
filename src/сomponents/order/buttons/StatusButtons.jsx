// noinspection JSValidateTypes

import React from "react";
import {Button, Modal, Space} from 'antd';
import {ArrowRightOutlined, CloseOutlined, PrinterOutlined} from '@ant-design/icons';
import PaymentForm from "../payment/PaymentForm";
import {isEqual} from 'lodash';

// noinspection JSUnresolvedReference
class StatusButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirmModalVisible: false,
            initialOrderData: this.normalizeOrderData(props.order_data)
        };
    }

    // Удаляем componentDidUpdate, чтобы initialOrderData не обновлялся автоматически

    showConfirmModal = () => {
        const currentData = this.normalizeOrderData(this.props.order_data);
        const { initialOrderData } = this.state;

        const hasChanges = !isEqual(currentData, initialOrderData);

        if (hasChanges) {
            this.setState({ isConfirmModalVisible: true });
        } else {
            this.handleClose();
        }
    };

    normalizeOrderData = (data) => {
        if (!data) return {};
        return { ...data };
    }

    handleClose = () => {
        window.location.href = "#";
        if (typeof this.props.onClose === 'function') {
            this.props.onClose();
        }
    };

    handleCancelClose = () => {
        this.setState({ isConfirmModalVisible: false });
    };

    render() {
        const currentData = this.normalizeOrderData(this.props.order_data);
        const { isConfirmModalVisible, initialOrderData } = this.state;
        const hasChanges = !isEqual(currentData, initialOrderData);

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
                                    justifyContent: 'flex-start',
                                    fontWeight: 500
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
                                    justifyContent: 'flex-start',
                                    fontWeight: 500
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
                            type="primary"
                            {...(!this.props.nextDisabed && { "data-button-id": "order-proceed" })}
                            disabled={this.props.nextDisabed}
                            style={{
                                minWidth: '120px',
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                visibility: this.props.nextHidden ? 'hidden' : 'visible',
                                fontWeight: 500,
                                boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
                                background: !this.props.nextDisabed ? '#73d13d' : 'default',
                                borderColor: !this.props.nextDisabed ? '#73d13d' : 'default'
                            }}
                        >
                            Далее
                            {<ArrowRightOutlined />}
                        </Button>
                    </Space>
                </Space>

                <Modal
                    title="Подтверждение действия"
                    open={isConfirmModalVisible}
                    onCancel={this.handleCancelClose}
                    footer={[
                        <Button key="back" onClick={this.handleCancelClose}>
                            Нет
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            danger
                            href="#"
                            data-button-id="order-back-confirm"
                        >
                            Да
                        </Button>
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
import React from 'react';
import { Button, Row, Col, Space, Typography, Modal, DatePicker } from "antd";
import { ClockCircleOutlined, ProfileOutlined, RollbackOutlined } from "@ant-design/icons";
import moment from 'moment';
import _OrderTitle from "./order_title";
import _PackageSwitch from "./buttons/package_switch";
import NumberInputPadModal from "./clientSelector/clientSelector";
import PromoCodeModal from "./cert/cert";

const { Text } = Typography;

const isEmptyDate = (date) => {
    return date && date.year() === 1 && date.month() === 0 && date.date() === 1;
};

class _OrderHeader extends React.Component {
    constructor(props) {
        super(props);
        const initialDate = props.order_data.scheduledTime ? moment(props.order_data.scheduledTime) : null;

        this.state = {
            showDateTimePicker: false,
            selectedDateTime: isEmptyDate(initialDate) ? null : initialDate,
            isTemporaryOrder: props.order_data.scheduled && !isEmptyDate(initialDate),
            showRefundModal: false
        };
    }

    handleOpenDateTimePicker = () => {
        this.setState({
            showDateTimePicker: true,
            tempDateTime: this.state.selectedDateTime || moment().add(1, 'hour').startOf('hour')
        });
    };

    handleDateTimeChange = (date) => {
        if (isEmptyDate(date)) {
            this.setState({ tempDateTime: null });
            return;
        }
        this.setState({ tempDateTime: date });
    };

    handleDateTimeConfirm = () => {
        const { tempDateTime } = this.state;

        if (!tempDateTime || isEmptyDate(tempDateTime)) {
            this.handleDateTimeClear();
            return;
        }

        this.setState({
            showDateTimePicker: false,
            selectedDateTime: tempDateTime,
            isTemporaryOrder: true
        });

        this.props.updateScheduledStatus(true);
        this.props.updateScheduledTime(tempDateTime);
    };

    handleDateTimeClear = () => {
        this.setState({
            showDateTimePicker: false,
            selectedDateTime: null,
            isTemporaryOrder: false,
            tempDateTime: null
        }, () => {
            this.props.updateScheduledStatus(false);
            this.props.updateScheduledTime(null);
        });
    };

    showRefundConfirm = () => {
        this.setState({ showRefundModal: true });
    };

    handleRefundCancel = () => {
        this.setState({ showRefundModal: false });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const nextDate = nextProps.order_data.scheduledTime ? moment(nextProps.order_data.scheduledTime) : null;

        if (nextProps.order_data.scheduledTime !== prevState.prevScheduledTime) {
            return {
                prevScheduledTime: nextProps.order_data.scheduledTime,
                selectedDateTime: isEmptyDate(nextDate) ? null : nextDate,
                isTemporaryOrder: nextProps.order_data.scheduled && !isEmptyDate(nextDate)
            };
        }
        return null;
    }

    render() {
        const { isTemporaryOrder, selectedDateTime, showDateTimePicker, tempDateTime, showRefundModal } = this.state;
        const { order_data, updatePackage, updateClient, disabled, hidden } = this.props;

        return (
            <div style={{
                paddingTop: '8px',
                paddingRight: '2px',
                paddingBottom: '8px',
                background: '#fff',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <div style={{ marginBottom: 8 }}>
                    <_OrderTitle {...order_data} />
                </div>

                <Row align="middle" justify="space-between">
                    <Col style={{
                        pointerEvents: disabled ? 'none' : 'auto',
                        opacity: disabled ? 0.5 : 1,
                        cursor: disabled ? 'not-allowed' : 'default',
                        visibility: hidden ? 'hidden' : 'default',
                    }}>
                        <Space size={6} wrap>
                            <_PackageSwitch
                                size="middle"
                                updatePackage={updatePackage}
                                initialPackageType={order_data.package}
                            />

                            <Button
                                size="middle"
                                type={isTemporaryOrder ? 'primary' : 'default'}
                                icon={<ClockCircleOutlined />}
                                onClick={this.handleOpenDateTimePicker}
                            >
                                {isTemporaryOrder && selectedDateTime ? (
                                    selectedDateTime.format('DD.MM.YYYY HH:mm')
                                ) : (
                                    'Временной'
                                )}
                            </Button>

                            <PromoCodeModal size="middle" />
                            <NumberInputPadModal
                                size="middle"
                                clientData={order_data.client}
                                onClientChange={updateClient}
                            />
                        </Space>
                    </Col>

                    <Col style={{
                        pointerEvents: !disabled ? 'none' : 'auto',
                        opacity: !disabled ? 0.5 : 1,
                        cursor: !disabled ? 'not-allowed' : 'default',
                        visibility: hidden ? 'hidden' : 'default',
                    }}>
                        <Space size={6}>
                            <Button size="middle" icon={<ProfileOutlined />} href="#" data-button-id="order-write-down-act">Акт списания</Button>
                            <div style={{
                                pointerEvents: order_data.refund ? 'none' : 'auto',
                                opacity: order_data.refund ? 0.5 : 1,
                                cursor: order_data.refund ? 'not-allowed' : 'default',
                                visibility: hidden ? 'hidden' : 'default',
                            }}>
                            <Button size="middle" icon={<RollbackOutlined />} onClick={this.showRefundConfirm}>Возврат</Button>
                            </div>
                        </Space>
                    </Col>
                </Row>

                <Modal
                    title="Укажите дату и время доставки"
                    visible={showDateTimePicker}
                    onCancel={() => this.setState({ showDateTimePicker: false })}
                    footer={[
                        <Button
                            key="clear"
                            danger
                            onClick={this.handleDateTimeClear}
                        >
                            Очистить
                        </Button>,
                        <Button
                            key="confirm"
                            type="primary"
                            onClick={this.handleDateTimeConfirm}
                            disabled={!tempDateTime || isEmptyDate(tempDateTime)}
                        >
                            Подтвердить
                        </Button>
                    ]}
                    width={400}
                >
                    <DatePicker
                        showTime={{
                            format: 'HH:mm',
                            minuteStep: 15,
                            showNow: true,
                            hideDisabledOptions: true,
                            use12Hours: false
                        }}
                        format="DD.MM.YYYY HH:mm"
                        style={{ width: '100%' }}
                        onChange={this.handleDateTimeChange}
                        value={tempDateTime && !isEmptyDate(tempDateTime) ? tempDateTime : null}
                        placeholder="Выберите дату и время"
                        disabledDate={(current) => current && current < moment().startOf('day')}
                        onOk={(value) => {
                            this.handleDateTimeChange(value);
                        }}
                        allowClear={false}
                    />
                </Modal>

                <Modal
                    title="Подтверждение возврата"
                    visible={showRefundModal}
                    onCancel={this.handleRefundCancel}
                    footer={[
                        <Button key="cancel" onClick={this.handleRefundCancel}>
                            Отмена
                        </Button>,
                        <Button
                            key="confirm"
                            type="primary"
                            href="#"
                            data-button-id="order-refund"
                            onClick={this.handleRefundCancel}
                        >
                            Да
                        </Button>
                    ]}
                >
                    <p>Вы уверены, что желаете произвести возврат продажи?</p>
                </Modal>
            </div>
        );
    }
}

export default _OrderHeader;
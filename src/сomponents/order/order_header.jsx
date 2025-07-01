import React from 'react';
import { Button, Row, Col, Space, Typography, Modal, TimePicker, DatePicker } from "antd";
import {
    ClockCircleOutlined,
    FileOutlined,
    PercentageOutlined,
    ProfileOutlined,
    RollbackOutlined,
    CheckOutlined,
    CloseOutlined
} from "@ant-design/icons";
import moment from 'moment';
import _OrderTitle from "./order_title";
import _PackageSwitch from "./buttons/package_switch";
import NumberInputPadModal from "./clientSelector/clientSelector";
import PromoCodeModal from "./cert/cert";

const { Text } = Typography;

class _OrderHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTemporaryOrder: props.order_data.scheduled || false,
            isBSO: false,
            showDateTimePicker: false,
            selectedDateTime: props.order_data.scheduledTime ? moment(props.order_data.scheduledTime) : null
        };
    }

    handleDateTimeConfirm = () => {
        if (this.state.selectedDateTime) {
            this.setState({
                isTemporaryOrder: true,
                showDateTimePicker: false
            });
            this.props.updateScheduledStatus(true);
            this.props.updateScheduledTime(this.state.selectedDateTime);
        }
    };

    handleDateTimeClear = () => {
        this.setState({
            selectedDateTime: null,
            isTemporaryOrder: false,
            showDateTimePicker: false
        });
        this.props.updateScheduledStatus(false);
        this.props.updateScheduledTime(null);
    };

    handleDateTimeChange = (date) => {
        this.setState({ selectedDateTime: date });
        if (date) {
            this.props.updateScheduledTime(date);
            this.props.updateScheduledStatus(true);
        }
    };

    handleTimeChange = (time) => {
        const { selectedDateTime } = this.state;
        let newDateTime = selectedDateTime || moment();

        if (time) {
            newDateTime = newDateTime.set({
                hour: time.hour(),
                minute: time.minute(),
                second: 0
            });
        }

        this.setState({ selectedDateTime: newDateTime });
        this.props.updateScheduledTime(newDateTime);
        this.props.updateScheduledStatus(true);
    };

    componentDidUpdate(prevProps) {
        if (prevProps.order_data.scheduled !== this.props.order_data.scheduled ||
            prevProps.order_data.scheduledTime !== this.props.order_data.scheduledTime) {
            const { scheduled, scheduledTime } = this.props.order_data;
            this.setState({
                isTemporaryOrder: scheduled || false,
                selectedDateTime: scheduledTime ? moment(scheduledTime) : null
            });
        }
    }

    render() {
        const { isTemporaryOrder, selectedDateTime } = this.state;
        const { order_data, updatePackage, updateClient } = this.props;

        return (
            <div style={{
                padding: '8px 12px',
                background: '#fff',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <div style={{ marginBottom: 8 }}>
                    <_OrderTitle
                        order_number={order_data.order_number}
                        deleted={order_data.deleted}
                        status={order_data.status}
                        date={order_data.date}
                        project={order_data.project}
                    />
                </div>

                <div style={{
                    pointerEvents: this.props.disabled ? 'none' : 'auto',
                    opacity: this.props.disabled ? 0.5 : 1,
                    cursor: this.props.disabled ? 'not-allowed' : 'default',
                    visibility: this.props.hidden ? 'hidden' : 'default',
                }}>
                    <Row align="middle" justify="space-between">
                        <Col>
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
                                    onClick={() => this.setState({ showDateTimePicker: true })}
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

                        <Col>
                            <Space size={6}>
                                <Button size="middle" icon={<ProfileOutlined />}>Акт</Button>
                                <Button size="middle" icon={<RollbackOutlined />}>Возврат</Button>
                            </Space>
                        </Col>
                    </Row>
                </div>

                <Modal
                    title="Укажите дату и время"
                    visible={this.state.showDateTimePicker}
                    onCancel={() => this.setState({ showDateTimePicker: false })}
                    footer={[
                        <Button
                            key="clear"
                            icon={<CloseOutlined />}
                            onClick={this.handleDateTimeClear}
                            danger
                        >
                            Очистить
                        </Button>,
                        <Button
                            key="confirm"
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={this.handleDateTimeConfirm}
                            disabled={!this.state.selectedDateTime}
                        >
                            Подтвердить
                        </Button>
                    ]}
                    width={400}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="ДД.ММ.ГГГГ"
                            onChange={this.handleDateTimeChange}
                            value={this.state.selectedDateTime}
                            format="DD.MM.YYYY"
                        />
                        <TimePicker
                            style={{ width: '100%' }}
                            placeholder="ЧЧ:ММ"
                            onChange={this.handleTimeChange}
                            value={this.state.selectedDateTime}
                            format="HH:mm"
                        />
                    </Space>
                </Modal>
            </div>
        );
    }
}

export default _OrderHeader;
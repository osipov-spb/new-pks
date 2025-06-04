import React from 'react';
import { Button, Row, Col, Space, Typography, Input, Modal, TimePicker, DatePicker } from "antd";
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
import ClientSelectForm from "./clientSelector/clientSelector";
import PromoCodeModal from "./cert/cert";

const { Text } = Typography;

// Компонент DatePicker с маской ввода (аналогичный тому, что делали для даты рождения)
const DatePickerWithMask = ({ value, onChange, ...props }) => {
    const [inputValue, setInputValue] = React.useState('');

    const handleInputChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 8) {
            value = value.slice(0, 8);
        }

        let formattedValue = value;
        if (value.length > 4) {
            formattedValue = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4)}`;
        } else if (value.length > 2) {
            formattedValue = `${value.slice(0, 2)}.${value.slice(2)}`;
        }

        setInputValue(formattedValue);

        if (value.length === 8) {
            const day = parseInt(value.slice(0, 2), 10);
            const month = parseInt(value.slice(2, 4), 10) - 1;
            const year = parseInt(value.slice(4), 10);

            if (day > 0 && day <= 31 && month >= 0 && month <= 11) {
                const date = moment([year, month, day]);
                if (date.isValid()) {
                    onChange(date);
                }
            }
        } else if (value.length === 0) {
            onChange(null);
        }
    };

    const handleBlur = () => {
        if (inputValue.replace(/\D/g, '').length < 8) {
            setInputValue('');
            onChange(null);
        }
    };

    return (
        <DatePicker
            {...props}
            value={value}
            onChange={(date, dateString) => {
                onChange(date);
                setInputValue(dateString);
            }}
            format="DD.MM.YYYY"
            inputRender={(props) => (
                <input
                    {...props}
                    value={inputValue || (value ? value.format('DD.MM.YYYY') : '')}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="ДД.ММ.ГГГГ"
                />
            )}
        />
    );
};

class _OrderHeader extends React.Component {
    constructor(props) {
        super(props);

        // Получаем начальные значения из order_data
        const { scheduled, scheduledTime } = this.props.order_data;

        this.state = {
            isTemporaryOrder: scheduled || false,
            isBSO: false,
            showDateTimePicker: false,
            selectedDateTime: scheduledTime ? moment(scheduledTime) : null
        };
    }

    handleDateTimeConfirm = () => {
        if (this.state.selectedDateTime) {
            this.setState({
                isTemporaryOrder: true,
                showDateTimePicker: false
            });

            // Обновляем данные в родительском компоненте
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

        // Сбрасываем данные в родительском компоненте
        this.props.updateScheduledStatus(false);
        this.props.updateScheduledTime(null);
    };

    handleDateTimeChange = (date) => {
        this.setState({ selectedDateTime: date });

        // Если дата выбрана, сразу обновляем в родительском компоненте
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

        // Обновляем время в родительском компоненте
        this.props.updateScheduledTime(newDateTime);
        this.props.updateScheduledStatus(true);
    };
    componentDidUpdate(prevProps) {
        // Синхронизируем состояние, если props изменились
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
        const { order_data, updatePackage } = this.props;

        return (
            <div style={{
                padding: '8px 12px',
                background: '#fff',
                borderBottom: '1px solid #f0f0f0'
            }}>
                {/* Заголовок заказа */}
                <div style={{ marginBottom: 8 }}>
                    <_OrderTitle
                        order_number={this.props.order_data.order_number}
                        status={this.props.order_data.status}
                        date={this.props.order_data.date}
                        project={this.props.order_data.project}
                    />
                </div>

                {/* Панель с кнопками */}
                <div style={{
                    pointerEvents: this.props.disabled ? 'none' : 'auto',
                    opacity: this.props.disabled ? 0.5 : 1,
                    cursor: this.props.disabled ? 'not-allowed' : 'default',
                    visibility: this.props.hidden ? 'hidden' : 'default',
                }} >
                    <Row align="middle" justify="space-between">
                        <Col>
                            <Space size={6} wrap>
                                <_PackageSwitch
                                    size="middle"
                                    updatePackage={this.props.updatePackage}
                                    initialPackageType={this.props.order_data.package}
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

                                <Button
                                    size="middle"
                                    type={this.state.isBSO ? 'primary' : 'default'}
                                    icon={<FileOutlined />}
                                    onClick={() => this.setState({ isBSO: !this.state.isBSO })}
                                >
                                    БСО
                                </Button>

                                <PromoCodeModal size="middle" />
                                <ClientSelectForm
                                    size="middle"
                                    clientData={this.props.order_data.client}
                                    onClientChange={this.props.updateClient}
                                />

                                <Button size="middle" icon={<PercentageOutlined />}>
                                    Акции
                                </Button>
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

                {/* Модальное окно выбора даты и времени */}
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
                        <DatePickerWithMask
                            style={{ width: '100%' }}
                            placeholder="ДД.ММ.ГГГГ"
                            onChange={this.handleDateTimeChange}
                            value={this.state.selectedDateTime}
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
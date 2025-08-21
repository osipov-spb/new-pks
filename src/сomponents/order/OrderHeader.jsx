import React from 'react';
import {Alert, Button, Col, DatePicker, Form, Modal, Row, Select, Space} from "antd";
import {
    ClockCircleOutlined,
    CloseSquareOutlined,
    FileTextOutlined,
    ProfileOutlined,
    RollbackOutlined
} from "@ant-design/icons";
import moment from 'moment';
import OrderTitle from "./OrderTitle";
import PackageSwitch from "./buttons/PackageSwitch";
import NumberInputPadModal from "./clientSelector/ClientSelector";
import PromoCodeModal from "./cert/PromoCodeModal";

const { Option } = Select;

const isEmptyDate = (date) => {
    return date && date.year() === 1 && date.month() === 0 && date.date() === 1;
};

// noinspection JSUnresolvedReference
class OrderHeader extends React.Component {
    constructor(props) {
        super(props);
        const initialDate = props.order_data.scheduledTime ? moment(props.order_data.scheduledTime) : null;

        this.state = {
            showDateTimePicker: false,
            selectedDateTime: isEmptyDate(initialDate) ? null : initialDate,
            isTemporaryOrder: props.order_data.scheduled && !isEmptyDate(initialDate),
            showRefundModal: false,
            showCancelModal: false,
            showBSOModal: false,
            bsoNumbers: [],
            bsoForm: {
                date: props.order_data.bsoDate ? moment(props.order_data.bsoDate) : moment(),
                number: props.order_data.bsoNumber || ''
            }
        };
        window._OrderHeaderInstance = this;
    }

    componentDidMount() {
        // Добавляем функцию для загрузки номеров БСО в window
        window.loadBSONumbers = (numbersJson) => {
            try {
                const numbers = JSON.parse(numbersJson);
                this.setState({ bsoNumbers: numbers });
            } catch (e) {
                console.error('Error parsing BSO numbers', e);
            }
        };

        window.getCurrentBSOData = () => {
            // Проверяем, существует ли компонент _OrderHeader в DOM
            const orderHeader = document.querySelector('[data-component="_OrderHeader"]');
            if (!orderHeader) return null;

            // Получаем ссылку на экземпляр компонента (это работает если компонент сохраняет себя в window)
            const componentInstance = window._OrderHeaderInstance;
            if (!componentInstance) return null;

            // Возвращаем текущие данные из состояния компонента
            let bsoData = {
                date: componentInstance.state.bsoForm.date ? componentInstance.state.bsoForm.date.format('DD.MM.YYYY') : null,
                number: componentInstance.state.bsoForm.number || null
            };

            this.setState({ showBSOModal: false });
            return JSON.stringify(bsoData);
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

    showCancelConfirm = () => {
        this.setState({ showCancelModal: true });
    };

    handleCancelModalCancel = () => {
        this.setState({ showCancelModal: false });
    };

    showBSOModal = () => {
        this.setState({ showBSOModal: true });
    };

    handleBSOCancel = () => {
        this.setState({ showBSOModal: false });
    };

    handleBSOFormChange = (changedValues) => {
        this.setState(prevState => ({
            bsoForm: {
                ...prevState.bsoForm,
                ...changedValues
            }
        }));
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const nextDate = nextProps.order_data.scheduledTime ? moment(nextProps.order_data.scheduledTime) : null;
        const changes = {
            prevScheduledTime: nextProps.order_data.scheduledTime,
            selectedDateTime: isEmptyDate(nextDate) ? null : nextDate,
            isTemporaryOrder: nextProps.order_data.scheduled && !isEmptyDate(nextDate)
        };

        if (nextProps.order_data.bsoDate !== prevState.prevBSODate ||
            nextProps.order_data.bsoNumber !== prevState.prevBSONumber) {
            changes.prevBSODate = nextProps.order_data.bsoDate;
            changes.prevBSONumber = nextProps.order_data.bsoNumber;
            changes.bsoForm = {
                date: nextProps.order_data.bsoDate ? moment(nextProps.order_data.bsoDate) : moment(),
                number: nextProps.order_data.bsoNumber || ''
            };
        }

        return changes;
    }

    render() {
        const {
            isTemporaryOrder,
            selectedDateTime,
            showDateTimePicker,
            tempDateTime,
            showRefundModal,
            showCancelModal,
            showBSOModal,
            bsoNumbers,
            bsoForm
        } = this.state;
        const { order_data, updatePackage, updateClient, disabled, hidden } = this.props;

        // Проверяем условия для блокировки кнопки "Отменить"
        const isCancelDisabled = order_data.refund || order_data.paid || order_data.deleted;

        return (
            <div data-component="_OrderHeader" style={{
                paddingTop: '8px',
                paddingRight: '2px',
                paddingBottom: '6px',
                background: '#fff',
                // borderBottom: '1px solid #f0f0f0'
            }}>
                <div style={{ marginBottom: 6 }}>
                    <OrderTitle {...order_data} />
                </div>

                <Row align="middle" justify="space-between">
                    <Col style={{
                        pointerEvents: disabled ? 'none' : 'auto',
                        opacity: disabled ? 0.5 : 1,
                        cursor: disabled ? 'not-allowed' : 'default',
                        visibility: hidden ? 'hidden' : 'default',
                    }}>
                        <Space size={6} wrap>
                            <PackageSwitch
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
                            <Button
                                size="middle"
                                icon={<ProfileOutlined/>}
                                href="#"
                                data-button-id="order-write-down-act"
                            >
                                Списание
                            </Button>


                            <Button
                                size="middle"
                                type={order_data.bsoNumber ? 'primary' : 'default'}
                                icon={<FileTextOutlined/>}
                                href='#'
                                data-button-id={!order_data.paid ? "bso" : undefined}
                                disabled={order_data.paid|| order_data.bsoNumber}
                                onClick={this.showBSOModal}
                            >
                                {order_data.bsoNumber || 'БСО'}
                            </Button>


                            <Button
                                size="middle"
                                icon={<CloseSquareOutlined/>}
                                onClick={this.showCancelConfirm}
                                disabled={isCancelDisabled}
                            >
                                Отмена
                            </Button>

                            <div style={{
                                pointerEvents: (order_data.refund || !order_data.paid) ? 'none' : 'auto',
                                opacity: (order_data.refund || !order_data.paid) ? 0.5 : 1,
                                cursor: (order_data.refund || !order_data.paid) ? 'not-allowed' : 'default',
                                visibility: hidden ? 'hidden' : 'default',
                            }}>
                                <Button
                                    size="middle"
                                    icon={<RollbackOutlined/>}
                                    onClick={this.showRefundConfirm}
                                >
                                    Возврат
                                </Button>
                            </div>
                        </Space>
                    </Col>
                </Row>

                {/* Модальное окно для выбора даты/времени */}
                <Modal
                    title="Укажите дату и время доставки"
                    open={showDateTimePicker}
                    onCancel={() => this.setState({showDateTimePicker: false})}
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

                {/* Модальное окно для БСО */}
                <Modal
                    title="Бланк строгой отчетности (БСО)"
                    open={showBSOModal}
                    onCancel={this.handleBSOCancel}
                    footer={[
                        <Button key="cancel" onClick={this.handleBSOCancel}>
                            Отмена
                        </Button>,
                        <Button
                            key="confirm"
                            type="primary"
                            href="#"
                            data-button-id="bso-save"
                            //onClick={this.handleBSOConfirm}
                        >
                            Сохранить
                        </Button>
                    ]}
                    width={500}
                >
                    <Form layout="vertical">
                        <Alert
                            message="Внимание!"
                            description="После сохранения БСО заказ будет закрыт, и все несохраненные изменения будут потеряны."
                            type="warning"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                        <Form.Item label="Дата БСО">
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD.MM.YYYY"
                                value={bsoForm.date}
                                onChange={(date) => this.handleBSOFormChange({ date })}
                            />
                        </Form.Item>
                        <Form.Item label="Номер БСО">
                            <Select
                                showSearch
                                placeholder="Выберите номер БСО"
                                optionFilterProp="children"
                                value={bsoForm.number || undefined}
                                onChange={(number) => this.handleBSOFormChange({ number })}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                style={{ width: '100%' }}
                                dropdownMatchSelectWidth={false}
                            >
                                {bsoNumbers.map(num => (
                                    <Option key={num} value={num}>{num}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Модальное окно подтверждения возврата */}
                <Modal
                    title="Подтверждение возврата"
                    open={showRefundModal}
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

                {/* Модальное окно подтверждения отмены */}
                <Modal
                    title="Подтверждение отмены"
                    open={showCancelModal}
                    onCancel={this.handleCancelModalCancel}
                    footer={[
                        <Button key="cancel" onClick={this.handleCancelModalCancel}>
                            Нет
                        </Button>,
                        <Button
                            key="confirm"
                            type="primary"
                            href="#"
                            data-button-id="order-cancel"
                            onClick={this.handleCancelModalCancel}
                        >
                            Да
                        </Button>
                    ]}
                >
                    <p>Вы уверены, что хотите отменить заказ?</p>
                </Modal>
            </div>
        );
    }
}

export default OrderHeader;
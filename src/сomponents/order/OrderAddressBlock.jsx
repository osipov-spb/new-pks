// noinspection JSValidateTypes,JSUnresolvedReference

import React from 'react';
import {Button, Input, Modal, Pagination, Space, Spin, Typography} from 'antd';
import {EnvironmentOutlined, SearchOutlined, UserOutlined} from '@ant-design/icons';

const { Text } = Typography;

class OrderAddressBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            couriers: [],
            loadingCouriers: false,
            showCourierModal: false,
            courierSearchText: '',
            currentPage: 1,
            pageSize: 20
        };
    }

    componentDidMount() {
        window.setCouriersList = (couriersStr) => {
            try {
                const couriers = JSON.parse(couriersStr);
                this.setState({
                    couriers,
                    loadingCouriers: false,
                    currentPage: 1
                });
            } catch (e) {
                this.setState({ loadingCouriers: false });
            }
        };
    }


    isEmptyCourier = (courier) => {
        return !courier || courier.id === null || courier.id === "";
    };

    isEmptyAddress = (address) => {
        return !address || !address.street || address.street.trim() === "";
    };

    loadCouriers = () => {
        this.setState({
            loadingCouriers: true,
            showCourierModal: true,
            courierSearchText: '',
            currentPage: 1
        });

        if (window.loadCouriersList) {
            window.loadCouriersList();
        } else {
            this.setState({ loadingCouriers: false });
        }
    };

    handleCourierSelect = (courier) => {
        if (this.isEmptyCourier(courier)) {
            this.props.onCourierChange(null);
        } else {
            this.props.onCourierChange(courier);
        }
        this.setState({ showCourierModal: false });
    };

    handleSearch = (e) => {
        this.setState({
            courierSearchText: e.target.value,
            currentPage: 1
        });
    };

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    };

    renderCourierModal = () => {
        const { couriers, loadingCouriers, courierSearchText, currentPage, pageSize } = this.state;
        const { courier: selectedCourier } = this.props;

        const filteredCouriers = couriers.filter(courier =>
            courier.name.toLowerCase().includes(courierSearchText.toLowerCase()) ||
            (courier.phone && courier.phone.includes(courierSearchText))
        );

        const totalItems = filteredCouriers.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const paginatedCouriers = filteredCouriers.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
        );

        return (
            <Modal
                title={`Выбор курьера (${totalItems} найдено)`}
                open={this.state.showCourierModal}
                onCancel={() => this.setState({ showCourierModal: false })}
                footer={[
                    <Button
                        key="reset"
                        type="text"
                        danger
                        onClick={() => this.handleCourierSelect(null)}
                        disabled={this.isEmptyCourier(selectedCourier)}
                    >
                        Сбросить выбор
                    </Button>
                ]}
                width={600}
                bodyStyle={{ padding: '16px 0' }}
            >
                <div style={{ padding: '0 16px 16px', borderBottom: '1px solid #f0f0f0' }}>
                    <Input
                        placeholder="Поиск по имени или телефону"
                        allowClear
                        value={courierSearchText}
                        onChange={this.handleSearch}
                        style={{ width: '100%' }}
                        autoFocus
                    />
                </div>

                {loadingCouriers ? (
                    <div style={{ textAlign: 'center', padding: '24px' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', margin: '8px 0' }}>
                            {paginatedCouriers.map(courier => (
                                /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
                                <a href="#"
                                   data-button-id={`select-courier-id-${courier.id}`}
                                >
                                <div
                                    key={courier.id}
                                    style={{
                                        padding: '12px',
                                        borderBottom: '1px solid #f0f0f0',
                                        cursor: 'pointer',
                                        backgroundColor: selectedCourier?.id === courier.id ? '#e6f7ff' : 'white',
                                        ':hover': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }}
                                    onClick={() => this.handleCourierSelect(courier)}
                                >
                                    <Text strong>{courier.name}</Text>
                                    {courier.phone && <Text type="secondary" style={{ marginLeft: '8px' }}>{courier.phone}</Text>}
                                </div>
                                </a>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div style={{ padding: '16px', textAlign: 'center' }}>
                                <Pagination
                                    current={currentPage}
                                    total={totalItems}
                                    pageSize={pageSize}
                                    onChange={this.handlePageChange}
                                    showSizeChanger={false}
                                    showQuickJumper
                                />
                            </div>
                        )}
                    </>
                )}
            </Modal>
        );
    };

    render() {
        const {
            address,
            courier,
            disabled: blockDisabled = false,
            hidden: blockHidden = false,
            addressDisabled = false,
            addressHidden = false,
            courierDisabled = false,
            courierHidden = false
        } = this.props;

        const isCourierEmpty = this.isEmptyCourier(courier);
        const isAddressEmpty = this.isEmptyAddress(address);

        if (blockHidden) return null;

        return (
            <div style={{
                padding: '12px',
                marginTop: '6px',
                // borderTop: '1px solid #f0f0f0',
                // borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                background: '#fafafa',
                opacity: blockDisabled ? 0.6 : 1,
                pointerEvents: blockDisabled ? 'none' : 'auto',
                borderRadius: '10px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}>
                {/* Блок адреса */}
                {!addressHidden && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!isAddressEmpty ? (
                            <Space
                                align="center"
                                style={{
                                    flex: 1,
                                    padding: '4px 8px',
                                    background: '#f5f5f5',
                                    borderRadius: '4px',
                                    opacity: addressDisabled ? 0.6 : 1
                                }}
                            >
                                <EnvironmentOutlined style={{ color: '#1890ff' }} />
                                <Text style={{ fontSize: '13px' }}>
                                    {[address.street,
                                        !address.house ? null : 'д. ' + address.house,
                                        !address.buildingNumber ? null : 'к. ' + address.buildingNumber,
                                        !address.apartment ? null : 'кв. ' + address.apartment]
                                        .filter(Boolean)
                                        .join(', ')}
                                </Text>
                            </Space>
                        ) : (
                            <Text
                                type="secondary"
                                style={{
                                    flex: 1,
                                    fontSize: '13px',
                                    opacity: addressDisabled ? 0.6 : 1
                                }}
                            >
                                Адрес не указан
                            </Text>
                        )}

                        <Button
                            type={!isAddressEmpty ? "default" : "primary"}
                            size="small"
                            href="#"
                            {...(!(blockDisabled || addressDisabled) && { "data-button-id": "client_address" })}
                            icon={<SearchOutlined />}
                            disabled={blockDisabled || addressDisabled}
                        >
                            {!isAddressEmpty ? "Изменить" : "Выбрать"}
                        </Button>
                    </div>
                )}

                {/* Блок курьера */}
                {!courierHidden && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!isCourierEmpty ? (
                            <Space
                                align="center"
                                style={{
                                    flex: 1,
                                    padding: '4px 8px',
                                    background: '#f5f5f5',
                                    borderRadius: '4px',
                                    opacity: courierDisabled ? 0.6 : 1
                                }}
                            >
                                <UserOutlined style={{ color: '#1890ff' }} />
                                <Text style={{ fontSize: '13px' }}>
                                    {courier.name}
                                </Text>
                                {courier.phone && (
                                    <Text type="secondary" style={{ fontSize: '13px' }}>{courier.phone}</Text>
                                )}
                            </Space>
                        ) : (
                            <Text
                                type="secondary"
                                style={{
                                    flex: 1,
                                    fontSize: '13px',
                                    opacity: courierDisabled ? 0.6 : 1
                                }}
                            >
                                Курьер не выбран
                            </Text>
                        )}

                        <Button
                            type={!isCourierEmpty ? "default" : "primary"}
                            size="small"
                            href="#"
                            {...(!(blockDisabled || courierDisabled) && { "data-button-id": "courier-fill-start" })}
                            icon={<UserOutlined />}
                            onClick={this.loadCouriers}
                            disabled={blockDisabled || courierDisabled}
                        >
                            {!isCourierEmpty ? "Изменить" : "Выбрать"}
                        </Button>
                    </div>
                )}

                {this.renderCourierModal()}
            </div>
        );
    }
}

export default OrderAddressBlock;
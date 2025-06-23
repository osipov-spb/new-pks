import React from 'react';
import { Button, Typography, Modal, Spin, Input, Pagination, Space } from 'antd';
import { SearchOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';

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
                console.error('Failed to parse couriers data:', e);
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
            console.error('loadCouriersList function is not defined');
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
                visible={this.state.showCourierModal}
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
        const { address, courier, disabled, hidden } = this.props;
        const isCourierEmpty = this.isEmptyCourier(courier);
        const isAddressEmpty = this.isEmptyAddress(address);

        if (hidden) return null;

        return (
            <div style={{
                padding: '12px',
                borderTop: '1px solid #f0f0f0',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px', // Увеличено с 12px до 16px
                background: '#fafafa'
            }}>
                {/* Блок адреса */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!isAddressEmpty ? (
                        <Space
                            align="center"
                            style={{
                                flex: 1,
                                padding: '4px 8px',
                                background: '#f5f5f5',
                                borderRadius: '4px'
                            }}
                        >
                            <EnvironmentOutlined style={{ color: '#1890ff' }} />
                            <Text style={{ fontSize: '13px' }}> {/* Уменьшенный шрифт */}
                                {[address.street, address.house, address.buildingNumber, address.apartment]
                                    .filter(Boolean)
                                    .join(', ')}
                            </Text>
                        </Space>
                    ) : (
                        <Text type="secondary" style={{ flex: 1, fontSize: '13px' }}>Адрес не указан</Text>
                    )}

                    <Button
                        type={!isAddressEmpty ? "default" : "primary"}
                        size="small"
                        href="#"
                        data-button-id="client_adress"
                        icon={<SearchOutlined />}
                        onClick={() => window.openAddressSelector && window.openAddressSelector()}
                        disabled={disabled}
                    >
                        {!isAddressEmpty ? "Изменить" : "Выбрать"}
                    </Button>
                </div>

                {/* Блок курьера */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!isCourierEmpty ? (
                        <Space
                            align="center"
                            style={{
                                flex: 1,
                                padding: '4px 8px',
                                background: '#f5f5f5',
                                borderRadius: '4px'
                            }}
                        >
                            <UserOutlined style={{ color: '#1890ff' }} />
                            <Text style={{ fontSize: '13px' }}> {/* Убрано strong и уменьшен шрифт */}
                                {courier.name}
                            </Text>
                            {courier.phone && (
                                <Text type="secondary" style={{ fontSize: '13px' }}>{courier.phone}</Text>
                            )}
                        </Space>
                    ) : (
                        <Text type="secondary" style={{ flex: 1, fontSize: '13px' }}>Курьер не выбран</Text>
                    )}

                    <Button
                        type={!isCourierEmpty ? "default" : "primary"}
                        size="small"
                        href="#"
                        data-button-id="courier-fill-start"
                        icon={<UserOutlined />}
                        onClick={this.loadCouriers}
                        disabled={disabled}
                    >
                        {!isCourierEmpty ? "Изменить" : "Выбрать"}
                    </Button>
                </div>

                {this.renderCourierModal()}
            </div>
        );
    }
}

export default OrderAddressBlock;
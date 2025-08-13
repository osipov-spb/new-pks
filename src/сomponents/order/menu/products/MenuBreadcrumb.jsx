import React from "react";
import {HomeOutlined, RightOutlined} from '@ant-design/icons';
import {Space, Typography} from 'antd';
import PropTypes from 'prop-types';

const { Text } = Typography;

const MenuBreadcrumb = ({ title = 'Меню', level = 0, itemIndex = 'ROOT', updatePath, openFolder, isLast }) => {
    const handleClick = (e) => {
        if (!updatePath || !openFolder) return;
        e.preventDefault();
        try {
            updatePath(e, level);
            openFolder(e, 0, true, itemIndex);
        } catch (error) {
            console.error('Breadcrumb navigation error:', error);
        }
    };

    return (
        <Space size={4} style={{ display: 'flex', alignItems: 'center' }}>
            {!isLast ? (
                <>
                    {level === 0 ? (
                        <HomeOutlined
                            style={{
                                color: '#1890ff',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                            onClick={handleClick}
                        />
                    ) : (
                        <Text
                            onClick={handleClick}
                            style={{
                                color: '#1890ff',
                                cursor: 'pointer',
                                padding: '0 4px',
                                borderRadius: '4px',
                                transition: 'all 0.2s'
                            }}
                            className="breadcrumb-link"
                        >
                            {title}
                        </Text>
                    )}
                    <RightOutlined style={{
                        color: 'rgba(0,0,0,0.25)',
                        fontSize: '10px',
                        marginLeft: '6px'
                    }} />
                </>
            ) : (
                <>
                    {level === 0 ? (
                        <HomeOutlined
                            style={{
                                fontSize: '14px',
                                cursor: 'pointer',
                                marginTop:'4px'
                            }}
                        />
                    ) : (
                        <Text strong
                            style={{
                                color: '#595959',
                                cursor: 'pointer',
                                padding: '0 4px',
                                borderRadius: '4px',
                                transition: 'all 0.2s',
                                marginLeft: level === 0 ? 0 : '6px'
                            }}
                        >
                            {title}
                        </Text>
                    )}
                </>
            )}
        </Space>
    );
};

MenuBreadcrumb.propTypes = {
    title: PropTypes.string,
    level: PropTypes.number,
    itemIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updatePath: PropTypes.func.isRequired,
    openFolder: PropTypes.func.isRequired,
    isLast: PropTypes.bool
};

export default MenuBreadcrumb;
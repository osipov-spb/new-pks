import React from 'react';
import { Pagination, Card } from 'antd';
import MenuBreadcrumb from "./menu_breadcrumb";
import ItemButton from "./item_button";
import FolderButton from "./folder_button";
import PropTypes from 'prop-types';

class _ProductsMenu extends React.Component {
    constructor(props) {
        super(props);
        this.pageSize = 16;
        this.menu = Array.isArray(props.items) ? props.items : [];
        this.state = {
            currentPath: [{
                level: 0,
                index: 'ROOT',
                title: 'Меню'
            }],
            items: this.menu,
            currentPage: 1,
            currentItems: this.menu.slice(0, this.pageSize),
            searchResults: [],
            isSearchMode: false,
            prevPathBeforeSearch: null // Сохраняем путь до поиска
        };
    }

    searchItems = (query, items) => {
        let results = [];

        items.forEach(item => {
            if (item.folder && item.children) {
                results = [...results, ...this.searchItems(query, item.children)];
            } else if (!item.folder && item.title.toLowerCase().includes(query.toLowerCase())) {
                results.push(item);
            }
        });

        return results;
    }

    updatePath = (e, level) => {
        let newPath = this.state.currentPath.slice(0, level + 1);
        this.setState({
            currentPath: newPath
        })
    }

    changePage = (page) => {
        const start = (page - 1) * this.pageSize;
        const itemsToShow = this.state.isSearchMode ? this.state.searchResults : this.state.items;
        this.setState({
            currentPage: page,
            currentItems: itemsToShow.slice(start, start + this.pageSize)
        });
    };

    openFolder = (e, id = 0, fromBreadcrumb = false, pathIndex = 0) => {
        try {
            if (!fromBreadcrumb) {
                const clickedItem = this.state.currentItems.find(item => item && item.id === id);
                if (!clickedItem || !clickedItem.children) return;

                const newPath = [
                    ...this.state.currentPath,
                    {
                        level: this.state.currentPath.length,
                        index: this.state.items.indexOf(clickedItem),
                        title: clickedItem.title
                    }
                ];

                this.setState({
                    items: clickedItem.children,
                    currentItems: clickedItem.children.slice(0, this.pageSize),
                    currentPath: newPath,
                    currentPage: 1,
                    isSearchMode: false,
                    prevPathBeforeSearch: null
                });
            } else {
                if (pathIndex === 'ROOT') {
                    this.setState({
                        items: this.menu,
                        currentItems: this.menu.slice(0, this.pageSize),
                        currentPath: [this.state.currentPath[0]],
                        currentPage: 1,
                        isSearchMode: false,
                        prevPathBeforeSearch: null
                    });
                } else {
                    let currentMenu = this.menu;
                    const newPath = [this.state.currentPath[0]];

                    for (let i = 1; i <= pathIndex; i++) {
                        const pathItem = this.state.currentPath[i];
                        if (!pathItem || !currentMenu[pathItem.index]) {
                            console.error('Invalid navigation path');
                            return;
                        }
                        currentMenu = currentMenu[pathItem.index].children;
                        newPath.push(pathItem);
                        break;
                    }

                    this.setState({
                        items: currentMenu || [],
                        currentItems: (currentMenu || []).slice(0, this.pageSize),
                        currentPath: newPath,
                        currentPage: 1,
                        isSearchMode: false,
                        prevPathBeforeSearch: null
                    });
                }
            }
        } catch (error) {
            console.error('Navigation error:', error);
            this.setState({
                items: this.menu,
                currentItems: this.menu.slice(0, this.pageSize),
                currentPath: [{
                    level: 0,
                    index: 'ROOT',
                    title: 'Меню'
                }],
                currentPage: 1,
                isSearchMode: false,
                prevPathBeforeSearch: null
            });
        }
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.searchQuery !== this.props.searchQuery) {
            const query = this.props.searchQuery || '';

            if (query.trim() === '') {
                // Восстанавливаем состояние до поиска
                this.setState({
                    isSearchMode: false,
                    currentItems: this.state.prevPathBeforeSearch?.items || this.menu.slice(0, this.pageSize),
                    currentPage: 1,
                    currentPath: this.state.prevPathBeforeSearch?.path || [{
                        level: 0,
                        index: 'ROOT',
                        title: 'Меню'
                    }],
                    prevPathBeforeSearch: null
                });
            } else {
                // Сохраняем текущее состояние перед поиском
                if (!this.state.isSearchMode) {
                    this.setState({
                        prevPathBeforeSearch: {
                            path: [...this.state.currentPath],
                            items: [...this.state.items]
                        }
                    });
                }

                // Выполняем поиск
                const searchResults = this.searchItems(query, this.menu);
                this.setState({
                    isSearchMode: true,
                    searchResults: searchResults,
                    currentItems: searchResults.slice(0, this.pageSize),
                    currentPage: 1,
                    currentPath: [{
                        level: 0,
                        index: 'ROOT',
                        title: `Результаты поиска: "${query}"`
                    }]
                });
            }
        }

        if (!this.state.isSearchMode && prevState.currentPage !== this.state.currentPage) {
            const start = (this.state.currentPage - 1) * this.pageSize;
            this.setState({
                currentItems: this.state.items.slice(start, start + this.pageSize)
            });
        }
    }

    render() {
        const { currentItems, currentPath, currentPage, items, isSearchMode, searchResults } = this.state;

        const itemsToShow = isSearchMode ? searchResults : items;
        const filteredItems = isSearchMode
            ? currentItems.filter(item => item && !item.folder)
            : currentItems;

        return (
            <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {!this.props.collapsed && (
                    <>
                        <Card
                            bordered={false}
                            style={{
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                            bodyStyle={{padding: '10px'}}
                        >
                            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                                {currentPath.map((item, index) => item && (
                                    <MenuBreadcrumb
                                        key={index}
                                        title={item.title}
                                        updatePath={this.updatePath}
                                        openFolder={this.openFolder}
                                        level={item.level}
                                        itemIndex={item.index}
                                        isLast={index === currentPath.length - 1}
                                    />
                                ))}
                            </div>
                        </Card>

                        <div style={{
                            overflowY: 'auto',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            padding: '10px',
                            overflow: 'hidden'
                        }}>
                            {filteredItems.map((item, index) => item && (
                                <div key={item.id} style={{width: '100%'}}>
                                    {!item.folder ? (
                                        <ItemButton
                                            style={{width: '100%', padding: '4px'}}
                                            data={{
                                                index: index,
                                                id: item.id,
                                                price: item.price,
                                                discount: item.discount,
                                                title: item.title
                                            }}
                                        />
                                    ) : !isSearchMode && (
                                        <FolderButton
                                            style={{width: '100%', padding: '4px'}}
                                            data={{
                                                index: index,
                                                id: item.id,
                                                discount: item.discount,
                                                title: item.title
                                            }}
                                            openFolder={this.openFolder}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {itemsToShow.length > this.pageSize && (
                            <div style={{
                                textAlign: 'center',
                                padding: '8px',
                                borderTop: '1px solid #f0f0f0'
                            }}>
                                <Pagination
                                    current={currentPage}
                                    onChange={this.changePage}
                                    total={itemsToShow.length}
                                    pageSize={this.pageSize}
                                    showSizeChanger={false}
                                    showQuickJumper={false}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }
}

_ProductsMenu.propTypes = {
    items: PropTypes.array.isRequired,
    searchQuery: PropTypes.string,
    collapsed: PropTypes.bool
};

export default _ProductsMenu;
// noinspection JSCheckFunctionSignatures,JSUnresolvedReference

import React from 'react';
import {Pagination} from 'antd';
import MenuBreadcrumb from "./MenuBreadcrumb";
import ItemButton from "./ItemButton";
import FolderButton from "./FolderButton";
import PropTypes from 'prop-types';

// Глобальная ссылка на компонент
let productsMenuInstance = null;

class ProductsMenu extends React.Component {
    constructor(props) {
        super(props);
        productsMenuInstance = this;

        this.state = {
            currentPath: [{
                level: 0,
                index: 'ROOT',
                title: ''
            }],
            items: Array.isArray(props.items) ? this.sortItems(props.items) : [],
            currentPage: 1,
            currentItems: [],
            searchResults: [],
            isSearchMode: false,
            prevPathBeforeSearch: null,
            pageSize: this.calculatePageSize(),
            prevItems: null,
            suggestions: []
        };
    }

    // Новый метод для сортировки элементов по алфавиту
    sortItems = (items) => {
        if (!Array.isArray(items)) return items;

        return [...items].sort((a, b) => {
            // Сначала папки, затем товары
            if (a.folder && !b.folder) return -1;
            if (!a.folder && b.folder) return 1;

            // Сортировка по названию
            return a.title.localeCompare(b.title);
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (Array.isArray(nextProps.items) &&
            JSON.stringify(nextProps.items) !== JSON.stringify(prevState.prevItems)) {
            return {
                items: productsMenuInstance.sortItems(nextProps.items),
                prevItems: nextProps.items,
                currentItems: productsMenuInstance.sortItems(nextProps.items).slice(0, prevState.pageSize),
                currentPage: 1,
                isSearchMode: false,
                searchResults: [],
                prevPathBeforeSearch: null
            };
        }
        return null;
    }

    calculatePageSize = () => {
        const width = window.innerWidth;
        if (width >= 1920) return 36;
        if (width >= 1600) return 32;
        if (width >= 1366) return 24;
        if (width >= 1024) return 20;
        if (width >= 768) return 16;
        return 4;
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
        return this.sortItems(results); // Сортируем результаты поиска
    }

    handleResize = () => {
        const newPageSize = this.calculatePageSize();
        if (newPageSize !== this.state.pageSize) {
            this.setState({
                pageSize: newPageSize,
                currentPage: 1,
                currentItems: (this.state.isSearchMode ? this.state.searchResults : this.state.items)
                    .slice(0, newPageSize)
            });
        }
    }

    componentDidMount() {
        this.updateContainerHeight();
        window.addEventListener('resize', this.updateContainerHeight);

        this.setState({
            currentItems: (this.state.isSearchMode ? this.state.searchResults : this.state.items)
                .slice(0, this.state.pageSize)
        });
    }

    updateContainerHeight = () => {
        if (this.containerRef) {
            const height = this.containerRef.offsetHeight;
            this.setState({ containerHeight: height });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateContainerHeight);
        productsMenuInstance = null;
    }

    changePage = (page) => {
        const start = (page - 1) * this.state.pageSize;
        const itemsToShow = this.state.isSearchMode ? this.state.searchResults : this.state.items;
        this.setState({
            currentPage: page,
            currentItems: itemsToShow.slice(start, start + this.state.pageSize)
        });
    };

    openFolder = (e, id = 0, fromBreadcrumb = false, pathIndex = 0) => {
        try {
            let itemsToUse = this.state.items;
            let newPath = [...this.state.currentPath];

            if (!fromBreadcrumb) {
                const clickedItem = this.state.currentItems.find(item => item && item.id === id);
                if (!clickedItem || !clickedItem.children) return;

                newPath = [
                    ...this.state.currentPath,
                    {
                        level: this.state.currentPath.length,
                        index: this.state.items.findIndex(item => item.id === id),
                        title: clickedItem.title
                    }
                ];

                itemsToUse = this.sortItems(clickedItem.children); // Сортируем содержимое папки
            } else {
                // noinspection JSIncompatibleTypesComparison
                if (pathIndex === 'ROOT' || pathIndex === 0) {
                    itemsToUse = this.sortItems(this.props.items); // Сортируем корневые элементы
                    newPath = [this.state.currentPath[0]];
                } else {
                    let currentMenu = this.props.items;
                    newPath = [this.state.currentPath[0]];

                    for (let i = 1; i <= pathIndex; i++) {
                        const pathItem = this.state.currentPath[i];
                        if (!pathItem || !currentMenu[pathItem.index]) {
                            console.error('Invalid navigation path');
                            return;
                        }

                        newPath.push(pathItem);
                        currentMenu = currentMenu[pathItem.index].children;
                    }

                    itemsToUse = this.sortItems(currentMenu || []); // Сортируем содержимое папки
                }
            }

            this.setState({
                items: itemsToUse,
                currentItems: itemsToUse.slice(0, this.state.pageSize),
                currentPath: newPath,
                currentPage: 1,
                isSearchMode: false,
                prevPathBeforeSearch: null
            });
        } catch (error) {
            console.error('Navigation error:', error);
            this.setState({
                items: this.sortItems(this.props.items),
                currentItems: this.sortItems(this.props.items).slice(0, this.state.pageSize),
                currentPath: [{
                    level: 0,
                    index: 'ROOT',
                    title: ''
                }],
                currentPage: 1,
                isSearchMode: false,
                prevPathBeforeSearch: null
            });
        }
    };

    updatePath = (e, level) => {
        this.openFolder(e, 0, true, level);
    };

    handleItemClick = (item) => {
        if (window.orderAddItem) {
            window.orderAddItem(item.title, item.id, item.price);
        } else {
            console.error('orderAddItem function not found');
        }
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.searchQuery !== this.props.searchQuery) {
            const query = this.props.searchQuery || '';
            if (query.trim() === '') {
                this.setState({
                    isSearchMode: false,
                    currentItems: this.state.prevPathBeforeSearch?.items || this.sortItems(this.props.items).slice(0, this.state.pageSize),
                    currentPage: 1,
                    currentPath: this.state.prevPathBeforeSearch?.path || [{
                        level: 0,
                        index: 'ROOT',
                        title: ''
                    }],
                    prevPathBeforeSearch: null,
                    suggestions: []
                });
            } else {
                if (!this.state.isSearchMode) {
                    this.setState({
                        prevPathBeforeSearch: {
                            path: [...this.state.currentPath],
                            items: [...this.state.items]
                        }
                    });
                }

                const searchResults = this.searchItems(query, this.props.items);
                this.setState({
                    isSearchMode: true,
                    searchResults: searchResults,
                    currentItems: searchResults.slice(0, this.state.pageSize),
                    currentPage: 1,
                    currentPath: [{
                        level: 0,
                        index: 'ROOT',
                        title: `Результаты поиска: "${query}"`
                    }],
                    suggestions: []
                });
            }
        }

        if (!this.state.isSearchMode && prevState.currentPage !== this.state.currentPage) {
            const start = (this.state.currentPage - 1) * this.state.pageSize;
            this.setState({
                currentItems: this.state.items.slice(start, start + this.state.pageSize)
            });
        }
    }

    static updateSuggestionsGlobal(menuString) {
        try {
            if (!productsMenuInstance) return;

            const menuData = JSON.parse(menuString);
            const extractProducts = (items) => {
                let products = [];
                items.forEach(item => {
                    if (item.folder && item.children) {
                        products = [...products, ...extractProducts(item.children)];
                    } else if (!item.folder) {
                        products.push(item);
                    }
                });
                return products;
            };

            const menuItems = Array.isArray(menuData) ? menuData : (menuData.menu || []);
            const suggestions = [...extractProducts(menuItems)]
                .sort((a, b) => a.title.localeCompare(b.title)) // Сортируем предложения
                .slice(0, 4);

            productsMenuInstance.setState({ suggestions });
        } catch (error) {
            console.error('Error updating suggestions:', error);
        }
    }

    render() {
        const { currentItems, currentPath, currentPage, items, isSearchMode,
            searchResults, pageSize, suggestions } = this.state;

        const itemsToShow = isSearchMode ? searchResults : items;
        const filteredItems = isSearchMode
            ? currentItems.filter(item => item && !item.folder)
            : currentItems;

        // Жесткие высоты для каждой секции
        const HEADER_HEIGHT = 33;
        const SUGGESTIONS_HEIGHT = 91;
        const PAGINATION_HEIGHT = 38;
        const MAIN_CONTENT_HEIGHT = `calc(71vh - ${HEADER_HEIGHT + SUGGESTIONS_HEIGHT + PAGINATION_HEIGHT}px)`;

        return (
            <div style={{
                height: '81vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                width: '100%'
            }}>
                {!this.props.collapsed && (
                    <>
                        {/* Шапка с хлебными крошками */}
                        <div style={{
                            height: HEADER_HEIGHT,
                            padding: '8px',
                            borderBottom: '1px solid #f0f0f0',
                            flexShrink: 0
                        }}>
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
                        </div>

                        {/* Основной контент с жестко заданной высотой */}
                        <div style={{
                            height: MAIN_CONTENT_HEIGHT,
                            overflowY: 'auto',
                            padding: '2.5px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(126px, 1fr))',
                            width: 'calc(100%-5px)', // Учитываем padding
                            alignContent: 'flex-start'
                        }}>
                            {filteredItems.map((item, index) => item && (
                                <div key={item.id} style={{ minWidth: 0, padding:'2.5px'}}>
                                    {!item.folder ? (
                                        <ItemButton
                                            data={{
                                                index: index,
                                                id: item.id,
                                                price: item.price,
                                                discount: item.discount,
                                                title: item.title,
                                                stop: item.stop,
                                                composite: item.composite,
                                                suggestion: false
                                            }}
                                            onClick={() => this.handleItemClick(item)}
                                        />
                                    ) : !isSearchMode && (
                                        <FolderButton
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

                        <div style={{
                            height: PAGINATION_HEIGHT,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderTop: '1px solid #f0f0f0',
                            flexShrink: 0
                        }}>
                            <Pagination
                                current={currentPage}
                                onChange={this.changePage}
                                total={itemsToShow.length}
                                pageSize={pageSize}
                                showSizeChanger={false}
                                showQuickJumper={false}
                                size="middle"
                            />
                        </div>

                        <div style={{
                            height: SUGGESTIONS_HEIGHT,
                            overflowY: 'auto',
                            padding: '2.5px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(126px, 1fr))',
                            width: 'calc(100%-5px)', // Учитываем padding
                            alignContent: 'flex-start',
                            borderTop: '1px solid #f0f0f0',
                        }}>

                            {suggestions.map(item => (
                                <div key={item.id} style={{ minWidth: 0, padding:'2.5px'}}>
                                    <ItemButton
                                        key={item.id}
                                        data={{
                                            id: item.id,
                                            price: item.price,
                                            discount: item.discount,
                                            title: item.title,
                                            stop: item.stop,
                                            composite: item.composite,
                                            suggestion: true
                                        }}
                                        onClick={() => this.handleItemClick(item)}
                                    />
                                </div>
                            ))}

                        </div>


                    </>
                )}
            </div>
        );
    }
}

window.updateSuggestions = ProductsMenu.updateSuggestionsGlobal;

ProductsMenu.propTypes = {
    items: PropTypes.array.isRequired,
    searchQuery: PropTypes.string,
    collapsed: PropTypes.bool
};

export default ProductsMenu;
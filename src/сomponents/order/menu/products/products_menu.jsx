import React from 'react';
import { Pagination, Card } from 'antd';
import MenuBreadcrumb from "./menu_breadcrumb";
import ItemButton from "./item_button";
import FolderButton from "./folder_button";
import PropTypes from 'prop-types';

class _ProductsMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPath: [{
                level: 0,
                index: 'ROOT',
                title: 'Меню'
            }],
            items: Array.isArray(props.items) ? props.items : [],
            currentPage: 1,
            currentItems: [],
            searchResults: [],
            isSearchMode: false,
            prevPathBeforeSearch: null,
            pageSize: this.calculatePageSize() // Инициализируем pageSize в состоянии
        };
    }

    // Функция для расчета количества элементов на странице
    calculatePageSize = () => {
        const width = window.innerWidth;

        if (width >= 1920) return 32; // Для очень широких экранов
        if (width >= 1600) return 28;
        if (width >= 1366) return 24;
        if (width >= 1024) return 20;
        if (width >= 768) return 16;
        return 4; // Для мобильных устройств
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

    // Обработчик изменения размера окна
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
        // Инициализируем текущие элементы
        this.setState({
            currentItems: (this.state.isSearchMode ? this.state.searchResults : this.state.items)
                .slice(0, this.state.pageSize)
        });

        // Добавляем обработчик изменения размера окна
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        // Удаляем обработчик при размонтировании компонента
        window.removeEventListener('resize', this.handleResize);
    }

    // Обновляем методы, где используется pageSize
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
            if (!fromBreadcrumb) {
                // Оригинальная логика для открытия папки при клике на элемент
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
                    currentItems: clickedItem.children.slice(0, this.state.pageSize),
                    currentPath: newPath,
                    currentPage: 1,
                    isSearchMode: false,
                    prevPathBeforeSearch: null
                });
            } else {
                // Новая логика для навигации по хлебным крошкам
                if (pathIndex === 'ROOT' || pathIndex === 0) {
                    // Возврат в корень
                    this.setState({
                        items: this.props.items,
                        currentItems: this.props.items.slice(0, this.state.pageSize),
                        currentPath: [this.state.currentPath[0]],
                        currentPage: 1,
                        isSearchMode: false,
                        prevPathBeforeSearch: null
                    });
                    return;
                }

                // 1. Начинаем с корневого уровня
                let currentMenu = this.props.items;
                const newPath = [this.state.currentPath[0]]; // Корневой элемент

                // 2. Реконструируем путь до нужного уровня
                for (let i = 1; i <= pathIndex; i++) {
                    const pathItem = this.state.currentPath[i];
                    if (!pathItem || !currentMenu[pathItem.index]) {
                        console.error('Invalid navigation path');
                        return;
                    }

                    // 3. Добавляем текущий уровень в путь
                    newPath.push(pathItem);

                    // 4. Переходим на следующий уровень
                    currentMenu = currentMenu[pathItem.index].children;
                }

                // 5. Обновляем состояние
                this.setState({
                    items: currentMenu || [],
                    currentItems: (currentMenu || []).slice(0, this.state.pageSize),
                    currentPath: newPath,
                    currentPage: 1,
                    isSearchMode: false,
                    prevPathBeforeSearch: null
                });
            }
        } catch (error) {
            console.error('Navigation error:', error);
            // Сброс к корневому уровню при ошибке
            this.setState({
                items: this.props.items,
                currentItems: this.props.items.slice(0, this.state.pageSize),
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

    updatePath = (e, level) => {
        // Просто вызываем openFolder с соответствующими параметрами
        this.openFolder(e, 0, true, level);
    };

    // Обновляем componentDidUpdate для использования this.state.pageSize
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.searchQuery !== this.props.searchQuery) {
            const query = this.props.searchQuery || '';

            if (query.trim() === '') {
                this.setState({
                    isSearchMode: false,
                    currentItems: this.state.prevPathBeforeSearch?.items || this.props.items.slice(0, this.state.pageSize),
                    currentPage: 1,
                    currentPath: this.state.prevPathBeforeSearch?.path || [{
                        level: 0,
                        index: 'ROOT',
                        title: 'Меню'
                    }],
                    prevPathBeforeSearch: null
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
                    }]
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

    // Обновляем render для использования this.state.pageSize
    render() {
        const { currentItems, currentPath, currentPage, items, isSearchMode, searchResults, pageSize } = this.state;

        const itemsToShow = isSearchMode ? searchResults : items;
        const filteredItems = isSearchMode
            ? currentItems.filter(item => item && !item.folder)
            : currentItems;

        // Динамическое определение количества колонок в grid
        const gridColumns = Math.min(Math.max(Math.floor(window.innerWidth / 150), 2), 6);

        return (
            <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                width: '100%' // Добавляем явное ограничение по ширине
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
                                {currentPath && currentPath.map((item, index) => item && (
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
                            gridTemplateColumns: `repeat(auto-fill, minmax(125px, 1fr))`, // Адаптивные колонки
                            padding: '10px',
                            overflowX: 'hidden', // Запрещаем горизонтальный скролл
                            gap: '10px', // Добавляем отступы между элементами
                            width: 'calc(100% - 20px)', // Учитываем padding
                            boxSizing: 'border-box' // Учитываем padding в общей ширине
                        }}>
                            {filteredItems.map((item, index) => item && (
                                <div key={item.id} style={{
                                    width: '100%',
                                    minWidth: 0 // Важно для предотвращения "распирания"
                                }}>
                                    {!item.folder ? (
                                        <ItemButton
                                            style={{
                                                width: '100%',
                                                maxWidth: '125px', // Фиксированная максимальная ширина
                                                padding: '4px',
                                                boxSizing: 'border-box'
                                            }}
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
                                            style={{
                                                width: '100%',
                                                maxWidth: '125px', // Фиксированная максимальная ширина
                                                padding: '4px',
                                                boxSizing: 'border-box'
                                            }}
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

                        {itemsToShow.length > pageSize && (
                            <div style={{
                                textAlign: 'center',
                                padding: '8px',
                                borderTop: '1px solid #f0f0f0'
                            }}>
                                <Pagination
                                    current={currentPage}
                                    onChange={this.changePage}
                                    total={itemsToShow.length}
                                    pageSize={pageSize}
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
import React from 'react'
import ItemButton from "./item_button";
import {Breadcrumb, Input, Pagination, Row, Layout, Col} from 'antd';
import MenuBreadcrumb from "./menu_breadcrumb";
import FolderButton from "./folder_button";

const {Search} = Input;

class _ProductsMenu extends React.Component {
    constructor(props) {
        super(props);
        this.pageSize = 20
        this.menu = this.props.items;
        this.state = {
            currentPath: [
                {
                    level: 0,
                    index: 'ROOT',
                    //product_id: 0,
                    title: 'Меню'
                }
            ],
            items: this.menu,
            currentPage: 1,
            currentItems: this.menu.slice(0, this.pageSize)
        }
    }

    componentDidMount() {

    }

    updatePath = (e, level) => {
        let newPath = this.state.currentPath.slice(0, level + 1);
        console.log(newPath)
        this.setState({
            currentPath: newPath
        })

    }
    changePage = (page) => {
        let num1 = Number(page) - 1;
        let num2 = this.pageSize;
        let num3 = Number(num1 * num2);

        let newItems = this.state.items.slice(num3, Number(num3 + this.pageSize))

        this.setState({
            currentPage: page,
            currentItems: newItems
        })
    }

    openFolder = (e, id = 0, fromBreadcrumb = false, pathIndex = 0) => {
        if (!fromBreadcrumb) {
            this.state.currentItems.forEach((item) => {
                if (item.id == id) {
                    let itemIndex = this.state.items.indexOf(item);
                    console.log(itemIndex)
                    this.setState({
                        items: item.children,
                        currentItems: item.children.slice(0, this.pageSize)
                    })

                    let newPathElem = {
                        level: this.state.currentPath.length,
                        index: itemIndex,
                        //product_id: 0,
                        title: item.title
                    }
                    let newPath = this.state.currentPath
                    newPath.push(newPathElem)

                    this.setState({
                        currentPath: newPath
                    })
                    //this.changePage(1)
                    console.log(newPath)
                }
            });
        } else {
            if (pathIndex != 'ROOT') {
                let currentData = this.state.currentPath.slice(0, this.state.currentPath.length - 1);
                let currentMenu = this.menu
                console.log('currentData full:' + JSON.stringify(currentData))
                let firstEntry = true
                currentData.forEach((pathItem) => {
                    if (!firstEntry) {
                        currentMenu = currentMenu[pathItem.index]
                    } else {
                        firstEntry = false
                        console.log('firstEntry')
                    }
                })
                console.log('currentMenu: ' + JSON.stringify(currentMenu))

                this.setState({
                    items: currentMenu.children,
                    currentItems: currentMenu.children.slice(0, this.pageSize)
                })
            } else {
                this.setState({
                    items: this.menu,
                    currentItems: this.menu.slice(0, this.pageSize)
                })
            }
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={15}>
                        <Breadcrumb>
                            {this.state.currentPath
                                ? this.state.currentPath.map((item, index) => (
                                    <MenuBreadcrumb title={item.title} updatePath={this.updatePath}
                                                    openFolder={this.openFolder} level={item.level}
                                                    itemIndex={item.index}/>
                                ))
                                : null}
                        </Breadcrumb>
                    </Col>
                    <Col span={9}>
                        <Search
                            placeholder="Поиск по меню"
                            // onSearch={onSearch}
                            style={{
                                width: 200,
                            }}
                        />
                    </Col>

                </Row>

                <div className="style-btn-wrapper">
                    {this.state.currentItems
                        ? this.state.currentItems.map((item, index) => {
                            if (!item.folder) {
                                return (
                                    <div key={item.id}>
                                        <ItemButton data={{
                                            index: index,
                                            id: item.id,
                                            price: item.price,
                                            discount: item.discount,
                                            title: item.title
                                        }}/>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={item.id}>
                                        <FolderButton data={{
                                            index: index,
                                            id: item.id,
                                            discount: item.discount,
                                            title: item.title
                                        }} openFolder={this.openFolder}/>
                                    </div>)
                            }
                        })
                        : null}
                </div>
                <Pagination current={this.state.currentPage} onChange={this.changePage} total={this.state.items.length}
                            pageSize={this.pageSize}/>
            </div>
        )
    }
}

export default _ProductsMenu;
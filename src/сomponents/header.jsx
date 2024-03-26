import React from 'react'
import {PageHeader} from 'antd'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const storeName = ""

        this.setState({
            subtitle: storeName
        })

    window.header_SetStoreName = (storeName) => {
            this.setState(({subtitle: storeName}));
            return true        }
    }

    render() {
        return (
            <div>
                <PageHeader
                    className="site-page-header"
                    title="Заказы"
                    subTitle={this.state.subtitle}
                />
            </div>
        )
    }
}

export default Header;
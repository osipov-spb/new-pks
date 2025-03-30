import { Alert } from 'antd';
import React from 'react';

class _Alert extends React.Component {
    constructor(props) {
        super(props);
        if (this.props==undefined){ // Это условие для отладки из браузера, из 1С данные передаются всегда
            this.state = {
                message: '',
                type: 'info',
                isOn: false
            }
        }else {
            this.state = {
                message: this.props.message,
                type: this.props.type,
                isOn: false
            }
        }
    }

    componentDidMount() {
        window.show_alert = (text, type) => {
            this.setState({
                message: text,
                type: type,
                isOn: true
            })
        }
    }
    render() {
        let alertElem = undefined;

        if (this.state.isOn){
            alertElem =  <Alert message={this.state.message} type={this.state.type} closable showIcon />
        }

        return (
            <>
                {alertElem}
            </>
        )
    };
}

export default _Alert
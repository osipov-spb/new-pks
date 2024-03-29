import {Card, Progress, Space, Typography, Carousel, Radio} from 'antd'
import React, { useState } from 'react';
import Divider from "../divider";

const { Text, Title } = Typography;

const contentStyle = {
    height: '200px',
    color: 'black',
    lineHeight: '100px',
    textAlign: 'center',
    background: 'white',
    width: '200px'
};

const wrapper_style ={
    height: '200px',
    width: '200px'
};

class Motivation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {
        const _plan_completion = 0
        const _leader = ""
        const _place = 0
        const _trend = 0

        this.setState({
            plan_completion: _plan_completion,
            leader: _leader,
            place: _place,
            trend: _trend,
            dotPosition: 'left'
        })

        window.motivation_SetData = (_plan_completion, _leader, _place, _trend) => {
            this.setState(({
                plan_completion: _plan_completion,
                leader: _leader,
                place: _place,
                trend: _trend
            }));
            return true
        }
    }

    render() {
        return (
            <Carousel style={contentStyle} autoplay autoplaySpeed={5000} dotPosition='left'>
                <div class="wrapper" style={wrapper_style}>
                    <Space size='middle'>Выполнение плана<Progress type="circle"
                                                                   percent={this.state.plan_completion}
                                                                       width={45}/></Space>
                </div>
                <div class="wrapper" style={wrapper_style}>
                    <Space direction="horizontal"><Text>Лидер продаж: <Text
                        type="secondary">{this.state.leader}</Text></Text></Space>
                </div>
                <div class="wrapper" style={wrapper_style}>
                    <Space direction="horizontal"><Text>Ваше место: <Text
                        type="secondary">{this.state.place}</Text></Text></Space>
                </div>
                <div class="wrapper" style={wrapper_style}>
                   <Space direction="horizontal"><Text>Тенденция: <Text
                        type="secondary">{this.state.trend}</Text></Text></Space>
                </div>

            </Carousel>
        )
    }
}

export default Motivation;
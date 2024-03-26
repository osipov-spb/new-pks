import React from 'react'
import {Card, Progress, Space, Typography } from 'antd'

const { Text, Title } = Typography;
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
            trend: _trend
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
            <Card align='center' bordered={false}>
                <h4><Space size='middle'>Выполнение плана<Progress type="circle" percent={this.state.plan_completion}
                                                                  width={45}/></Space></h4>
                <Space direction="vertical" size='xs'>
                    <Space direction="horizontal"><Text>Лидер продаж: <Text type="secondary">{this.state.leader}</Text></Text></Space>
                    <Space direction="horizontal"><Text>Ваше место: <Text type="secondary">{this.state.place}</Text></Text></Space>
                    <Space direction="horizontal"><Text>Тенденция: <Text type="secondary">{this.state.trend}</Text></Text></Space>
                </Space>

            </Card>
        )
    }
}

export default Motivation;
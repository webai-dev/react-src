import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import Chartist                 from 'chartist';
import './styles.scss';

export const CHART_TYPE = {
    BAR: 'Bar',
    LINE: 'Line',
    PIE: 'Pie',
};


class ChartComponent extends PureComponent {
    UNSAFE_componentWillReceiveProps(newProps) {
        this.updateChart(newProps);
    }

    componentWillUnmount() {
        if (this.chartist) {
            try {
                this.chartist.detach();
            } catch (err) {
                throw new Error('Internal chartist error', err);
            }
        }
    }

    componentDidMount() {
        this.updateChart(this.props);
    }

    updateChart(props) {
        let { type, data } = props;
        let options = props.options || {};
        let responsiveOptions = props.responsiveOptions || [];
        // TODO don't delete but consider implement listener better if needed
        // let event;

        if (this.chartist) {
            this.chartist.update(data, options, responsiveOptions);
        } else {
            this.chartist = new Chartist[ type ](this.chart, data, options, responsiveOptions);

            // TODO don't delete but consider implement listener better if needed
            //  if-if-for-if is very bad for perfomance
            // if (props.listener) {
            //     for (event in props.listener) {
            //         if (props.listener.hasOwnProperty(event)) {
            //             this.chartist.on(event, props.listener[ event ]);
            //         }
            //     }
            // }
        }

        return this.chartist;
    }

    render() {
        const { className, style } = this.props;
        return (
            <div
                className={ `ct-chart ${ className || '' }` }
                ref={ (ref) => this.chart = ref }
                style={ style }
            />
        );
    }
}

ChartComponent.propTypes = {
    type: PropTypes.oneOf([ CHART_TYPE.BAR, CHART_TYPE.LINE, CHART_TYPE.PIE ]).isRequired,
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
    options: PropTypes.object,
    responsiveOptions: PropTypes.array,
    style: PropTypes.object
};

export default ChartComponent;

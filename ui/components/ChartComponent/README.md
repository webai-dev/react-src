# Chartist

- [Why chartist?](https://bundlephobia.com/result?p=chartist@0.11.3) - it is very lightweight
- [Chartist docs](http://gionkunz.github.io/chartist-js/getting-started.html)

## How use ChartComponent?

Here is simple code snippet:
```javascript
import React, { Fragment, }           from 'react';
import ChartComponent, { CHART_TYPE } from '../../../components/ChartComponent';

const MyFormComponent = () => {
    return (
        <ChartComponent
            data={ {
                labels: [ 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10' ],
                series: [
                    [ 1, 2, 4, 8, 6, -2, -1, -4, -6, -2, 2 ]
                ]
            } }
            options={ {
                high: 10,
                low: -10,
                axisX: {
                    labelInterpolationFnc: function (value, index) {
                        return index % 2 === 0 ? value : null;
                    }
                }
            } }
            type={ CHART_TYPE.BAR }
        />
    );
};
```

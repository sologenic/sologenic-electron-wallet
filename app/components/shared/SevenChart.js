import React, { Component } from 'react';
import Colors from '../../constants/Colors';
import { LineChart, Line, YAxis } from 'recharts';

// let data = {
//   datasets: [
//     {
//       data: []
//     }
//   ]
// };

class SevenChart extends Component {
  //   shouldComponentUpdate(nextProps) {
  //     if (this.props !== nextProps) {
  //       return true;
  //     }

  //     return false;
  //   }

  render() {
    const { marketSevens, color } = this.props;

    let data;
    let formattedData;

    if (marketSevens && marketSevens.o) {
      data = marketSevens.o;

      formattedData = data.map(item => {
        return {
          value: item
        };
      });

    }

    const testData = [{ value: 0.2023 }, { value: 0.207 }, { value: 0.2102 }];

    return (
      <LineChart data={formattedData} width={100} height={50}>
        <YAxis
          type="number"
          domain={['dataMin', 'dataMax']}
          axisLine={false}
          tickLine={false}
          tick={false}
          width={0}
        />
        <Line type="linear" dataKey="value" stroke={color} dot={false} />
      </LineChart>
    );
  }
}

export default SevenChart;

/* //   data={data}
        //   width={60}
        //   height={16}
        //   chartConfig={chartConfig}
        //   withDots={false}
        //   withShadow={false}
        //   bezier
        /> */

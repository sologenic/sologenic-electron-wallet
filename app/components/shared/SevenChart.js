//     Sologenic Wallet, Decentralized Wallet. Copyright (C) 2020 Sologenic

//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.

//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <https://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import Colors from '../../constants/Colors';
import { LineChart, Line, YAxis } from 'recharts';

class SevenChart extends Component {
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

import React, { Component } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

import styles from './styles.css';

export default class BenchmarkInfo extends Component {
  render() {
    const { downloadStats } = this.props;

    return (
      <div className={styles.infoWrapper}>
        {/* Chart */}
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={downloadStats.history}>
              <Line
                name="Speed (KB/s) over time (ms)"
                type="monotone"
                dataKey="speed"
                stroke="#8884d8"
                isAnimationActive={false}
                animationDuration={50}
              />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="elapsedTime" />
              <YAxis dataKey="speed" type="number" />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Statistics */}
        <div className={styles.stats}>
          <span>
            {`Started: ${new Date(
              downloadStats.startTime
            ).toLocaleTimeString()}`}
          </span>
          <span>
            {`Time elapsed: ${Math.round(downloadStats.elapsedTime)}ms`}
          </span>
          <span>
            {`Size: ${Math.round(downloadStats.downloadSize / 1024 / 1024)}MB`}
          </span>
          <span>
            {`Average speed: ${Math.round(downloadStats.avgSpeed)}KB/s`}
          </span>
        </div>
      </div>
    );
  }
}

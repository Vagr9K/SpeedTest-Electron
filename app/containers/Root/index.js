import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import UserInputs from '../UserInputs';
import BenchmarkInfo from '../BenchmarkInfo';
import Instructions from '../../components/Instructions';

import styles from './styles.css';

const DOWNLOADER_CHANNEL = 'downloader';

// This container handles applciation state and IPC communication with the main thread
export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: 'IDLE',
      downloadURL: null,
      downloadStats: {
        startTime: 0,
        elapsedTime: 0,
        downloadSize: 0,
        avgSpeed: 0,
        history: []
      }
    };
  }

  componentDidMount() {
    // Attach to events
    ipcRenderer.on(DOWNLOADER_CHANNEL, this.ipcHandler);
  }

  componentWillUnmount() {
    // Detach from events
    ipcRenderer.removeListener(DOWNLOADER_CHANNEL, this.ipcHandler);
  }

  ipcHandler = (event, eventType, data) => {
    const { downloadStats } = this.state;

    if (eventType === 'FINISH') {
      this.setState({ appState: 'FINISHED' });
    }

    if (eventType === 'PROGRESS') {
      const {
        progress,
        currentSpeed,
        elapsedTime,
        avgSpeed,
        startTime,
        downloadSize
      } = data;

      const history = [...downloadStats.history];
      history.push({
        elapsedTime,
        speed: currentSpeed
      });

      this.setState({
        downloadStats: {
          startTime,
          elapsedTime,
          downloadSize,
          avgSpeed,
          progress,
          history
        }
      });
    }
  };

  setDownloadURL = url => {
    this.setState({ downloadURL: url });
  };

  startBenchmark = () => {
    this.setState({ appState: 'DOWNLOADING' });
    // eslint-disable-next-line react/destructuring-assignment
    ipcRenderer.send(DOWNLOADER_CHANNEL, 'START', this.state.downloadURL);
  };

  stopBenchmark = () => {
    this.setState({ appState: 'IDLE' });
    // eslint-disable-next-line react/destructuring-assignment
    ipcRenderer.send(DOWNLOADER_CHANNEL, 'STOP', this.state.downloadURL);
  };

  render() {
    const { appState, downloadStats, downloadURL } = this.state;

    return (
      <div className={styles.rootContainer}>
        <div className={styles.infoContainer}>
          {appState === 'IDLE' ? (
            <Instructions setDownloadURL={this.setDownloadURL} />
          ) : (
            <BenchmarkInfo downloadStats={downloadStats} />
          )}
        </div>
        <div className={styles.controlContainer}>
          <UserInputs
            appState={appState}
            startBenchmark={this.startBenchmark}
            stopBenchmark={this.stopBenchmark}
            downloadURL={downloadURL}
            setDownloadURL={this.setDownloadURL}
          />
        </div>
      </div>
    );
  }
}

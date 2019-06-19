import React, { Component } from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

import styles from './styles.css';

export default class UserInputs extends Component {
  render() {
    const {
      appState,
      setDownloadURL,
      downloadURL,
      startBenchmark,
      stopBenchmark
    } = this.props;

    const buttonText =
      appState === 'DOWNLOADING' ? 'Cancel speedtest' : 'Start speedtest';
    const isButtonDisabled = downloadURL === null || downloadURL.length === 0;

    const buttonAction = () => {
      if (appState === 'DOWNLOADING') return stopBenchmark();

      return startBenchmark();
    };

    return (
      <div className={styles.userInputContainer}>
        <TextField
          className={styles.urlUserInput}
          placeholder="Remote data URL"
          onChange={e => {
            setDownloadURL(e.target.value);
          }}
          value={downloadURL || null}
        />

        <PrimaryButton disabled={isButtonDisabled} onClick={buttonAction}>
          {buttonText}
        </PrimaryButton>
      </div>
    );
  }
}

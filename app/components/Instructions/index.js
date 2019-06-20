import React, { Component } from 'react';

import styles from './styles.css';

export default class Instructions extends Component {
  render() {
    const { setDownloadURL } = this.props;

    const sampleURLs = [
      'https://speed.hetzner.de/100MB.bin',
      'http://www.ovh.net/files/100Mb.dat'
    ];

    const clickHandler = url => e => {
      e.stopPropagation();
      e.preventDefault();
      setDownloadURL(url);
    };

    return (
      <div className={styles.instructions}>
        <p>Input a remote resource URL to start the speedtest</p>
        <p>You can use one of the following examples:</p>
        {sampleURLs.map(url => (
          <a href="#" key={url} onClick={clickHandler(url)}>
            {url}
          </a>
        ))}
      </div>
    );
  }
}

const { ipcMain, net } = require('electron');

const DOWNLOADER_CHANNEL = 'downloader';

export default class Downloader {
  constructor(targetWorker) {
    // Stores ClientRequest objects to allow cancelling benchmarks
    this.requestMapping = {};
    // Stores request state to prevent buffered events after the request has been cancelled
    this.isRequestActive = {};
    // Target worker process to send events to
    this.targetWorker = targetWorker;
  }

  init = () => {
    // Register the listener
    ipcMain.on(DOWNLOADER_CHANNEL, this.listener);
  };

  startBenchmark = url => {
    console.log(`DOWNLOADER: Starting benchmark for ${url}.`);
    const request = net.request(url);

    // Map the request data
    this.requestMapping[url] = request;
    this.isRequestActive[url] = true;

    request.on('response', response => {
      console.log(
        `DOWNLOADER: Status reply from ${url} is ${response.statusCode}.`
      );

      // Initialize request specific stats
      const startTime = new Date().getTime();
      let lastProgressTimeStamp = new Date().getTime();
      let lastReceivedByteCount = 0;
      let fullReceivedByteCount = 0;
      let lastNotifiedCompletionState = 0;
      const [downloadSize] = response.headers['content-length'];

      // Notify the render thread about new stats whenever we receive data
      response.on('data', chunk => {
        // Check if cancelled
        if (!this.isRequestActive[url]) return;

        lastReceivedByteCount = chunk.length;
        fullReceivedByteCount += lastReceivedByteCount;

        const currentSpeed = Math.round(
          lastReceivedByteCount / (new Date().getTime() - lastProgressTimeStamp)
        );

        lastProgressTimeStamp = new Date().getTime();
        const elapsedTime = lastProgressTimeStamp - startTime;

        const avgSpeed = Math.round(fullReceivedByteCount / elapsedTime);

        const progress = fullReceivedByteCount / downloadSize;

        // Notify 2 times per second
        const notificationFrequency = 2 / 1000;
        const currentlyReachedBarrier = Math.round(
          elapsedTime * notificationFrequency
        );
        if (currentlyReachedBarrier > lastNotifiedCompletionState) {
          lastNotifiedCompletionState = currentlyReachedBarrier;

          this.targetWorker.send(DOWNLOADER_CHANNEL, 'PROGRESS', {
            progress,
            currentSpeed,
            elapsedTime,
            avgSpeed,
            startTime,
            downloadSize
          });
        }
      });

      // Notify the worker thread about the download being finished
      response.on('end', () => {
        this.targetWorker.send(DOWNLOADER_CHANNEL, 'FINISH');
        console.log(`DOWNLOADER: Request of ${url} is finished.`);
      });
    });
    request.end();
  };

  cancelBenchmark = url => {
    this.isRequestActive[url] = false;
    this.requestMapping[url].abort();
  };

  // Event listener for the channel
  listener = (event, action, data) => {
    if (action === 'START') this.startBenchmark(data);
    if (action === 'CANCEL') this.cancelBenchmark(data);
  };
}

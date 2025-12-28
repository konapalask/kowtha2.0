import { parentPort, workerData } from 'worker_threads';
import { processAndUploadImage } from '../common/s3utils/s3.service';

(async () => {
  try {
    const { s3ImageUrl, latitude, longitude, timestamp } = workerData;
    const result = await processAndUploadImage(s3ImageUrl, latitude, longitude, timestamp);
    parentPort.postMessage({ success: true, result });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
})();

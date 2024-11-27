import { createServer } from 'http';
import next from 'next';
import express from 'express';
import cron from 'node-cron';
import { fetchJson } from './utils/request';

const port = parseInt(process.env.PORT || '3000', 10);
const isDev = process.env.NODE_ENV !== 'production';
const apiUrl = `http://localhost:${port}/api`;
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  async function downloadJob() {
    console.log('Start downloading the latest daily leaderboard tasks');
    try {
      for (const item of ['kuwo', 'kugou', 'netease']) {
        console.log(`Downloading with: ${item}`);
        await fetchJson(`${apiUrl}/music/download/rank`, {
          method: 'POST',
          body: { ids: [4, 5, 16, 17, 26, 27, 62, 63], source: item },
        });
      }
    } catch (err) {
      console.log('Download Daily Latest Leaderboard Quest Failed: ', err);
    } finally {
      console.log('End Download Daily Update Leaderboard Tasks');
    }
  }

  cron.schedule('0 1 1 * * *', async () => {
    await downloadJob();
  });

  cron.schedule('0 1 7 * * *', async () => {
    await downloadJob();
  });

  cron.schedule('0 19 17 * * *', async () => {
    await downloadJob();
  });

  const server = express();
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  createServer(server).listen(port);
  console.log(
    `> Server listening at http://localhost:${port} as ${
      isDev ? 'development' : process.env.NODE_ENV
    }`
  );
});

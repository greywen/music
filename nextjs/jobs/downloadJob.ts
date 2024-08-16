import { getMusicList } from '../service/music';
import prisma from '../prisma/prisma';
import downloadMusic from '../utils/downloadMusic';

export default async function downloadJob() {
  const runningJob = await prisma.job.findFirst({
    where: { status: 'Running' },
  });
  if (runningJob) {
    console.log(`download job ${runningJob.id}:` + runningJob.params);
    return;
  }

  const pendingJob = await prisma.job.findFirst({
    where: { status: 'Pending' },
  });
  if (!pendingJob) {
    return;
  }

  await prisma.job.update({
    where: { id: pendingJob.id },
    data: { status: 'Running' },
  });

  try {
    const params = JSON.parse(pendingJob.params);
    let musicList = [];
    if (Array.isArray(params)) {
      musicList = params;
    } else {
      musicList = await getMusicList(params);
    }
    await downloadMusic(musicList);
    await prisma.job.update({
      where: { id: pendingJob.id },
      data: { status: 'Done' },
    });
    console.log(`download job ${pendingJob.id} done`);
  } catch (error) {
    console.log('download job error: ', JSON.stringify(error));
    await prisma.job.update({
      where: { id: pendingJob.id },
      data: { status: 'Failed' },
    });
  }
}

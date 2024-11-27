import { getTopList, TOP_IDS } from '@/services/qq';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');
  if (!ids) {
    throw new Error('ids is required');
  }
  const idList = ids.split(',').map((x) => Number(x));
  const topIds = TOP_IDS.filter((id) => idList.includes(id));
  const topResult = await getTopList();
  if (topResult.code !== 200) {
    return NextResponse.json(topResult);
  } else {
    const tops = topResult.data
      .filter((x) => topIds.includes(x.id))
      .map((x) => ({
        id: x.id,
        songList: x.songList,
      }));
    return NextResponse.json({
      code: 200,
      data: tops,
    });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const source = searchParams.get('source');
  const size = searchParams.get('size');
  return new Response('Hello, Next.js!');
}

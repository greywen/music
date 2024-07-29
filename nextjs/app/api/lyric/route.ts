export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  console.log(name);
  return new Response('Hello, Next.js!');
}
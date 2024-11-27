interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: any;
}

export async function fetchJson<T>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body } = config;
  try {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });

    return (await response.json()) as T;
  } catch (err) {
    throw new Error('Failed to fetch data ' + url);
  }
}

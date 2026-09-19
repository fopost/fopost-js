/**
 * Internal HTTP client. Wraps fetch with auth, JSON encoding/decoding,
 * the {data: ...} envelope unwrap, and a typed error class.
 */

export class FoPostError extends Error {
  status: number;
  code?: string;
  body?: unknown;
  constructor(message: string, status: number, code?: string, body?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.body = body;
    this.name = 'FoPostError';
  }
}

export type HttpClientOptions = {
  apiKey: string;
  baseUrl?: string;
  /** Override the global fetch (testing, custom transports). */
  fetch?: typeof fetch;
};

export const DEFAULT_BASE_URL = 'https://api.fopost.com';

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  /** The fetch in use; direct uploads PUT bytes through it without the API key. */
  readonly fetchImpl: typeof fetch;

  constructor(opts: HttpClientOptions) {
    if (!opts.apiKey) {
      throw new Error('FoPost: apiKey is required');
    }
    this.apiKey = opts.apiKey;
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.fetchImpl = opts.fetch ?? globalThis.fetch.bind(globalThis);
  }

  async request<T>(
    method: string,
    path: string,
    body?: unknown,
    query?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    const url = new URL(this.baseUrl + path);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      }
    }

    const res = await this.fetchImpl(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        'User-Agent': '@fopost/sdk',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      if (!res.ok) {
        const text = await res.text();
        throw new FoPostError(text || `HTTP ${res.status}`, res.status);
      }
      throw new FoPostError(`Unexpected response: ${contentType}`, res.status);
    }

    const json = (await res.json()) as Record<string, unknown>;

    if (!res.ok) {
      const message =
        (typeof json.message === 'string' && json.message) ||
        (typeof json.error === 'string' && json.error) ||
        `HTTP ${res.status}`;
      throw new FoPostError(message, res.status, json.error as string | undefined, json);
    }

    if (json && typeof json === 'object' && 'data' in json && Object.keys(json).length === 1) {
      return json.data as T;
    }
    return json as T;
  }

  get<T>(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>('GET', path, undefined, query);
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  delete<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('DELETE', path, body);
  }
}

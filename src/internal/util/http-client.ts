/*
 * Copyright 2021 ALE International
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 * to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import fetchCookie from 'fetch-cookie';
import { CookieJar } from 'tough-cookie';
import { Agent } from 'undici';
import { IHttpClient } from './IHttpClient';
import { HttpContent } from './http-content';
import { HttpResponse } from './http-response';

enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

/** @internal */
export default class HttpClient implements IHttpClient {
    static DUMP_COOKIES: boolean = false;

    readonly #cookieJar: CookieJar;
    readonly #fetchFunction: typeof fetch;

    constructor(ca?: string | Buffer | Array<string | Buffer>, allowSelfSigned?: boolean) {
        this.#cookieJar = new CookieJar();

        if (ca || allowSelfSigned) {
            // Node.js 18+ global fetch is undici-based. Pass a custom undici
            // Agent as `dispatcher` to scope TLS options to this SDK instance
            // only, without touching the global Node.js TLS configuration.
            const connectOptions: {
                ca?: string | Buffer | Array<string | Buffer>;
                rejectUnauthorized?: boolean;
            } = {};
            if (ca) connectOptions.ca = ca;
            if (allowSelfSigned) connectOptions.rejectUnauthorized = false;

            const dispatcher = new Agent({ connect: connectOptions });
            const fetchWithTls = (
                input: RequestInfo | URL,
                init?: RequestInit
            ): Promise<Response> =>
                (fetch as (i: RequestInfo | URL, init?: object) => Promise<Response>)(
                    input,
                    { ...(init ?? {}), dispatcher }
                );
            this.#fetchFunction = fetchCookie(fetchWithTls as typeof fetch, this.#cookieJar);
        } else {
            this.#fetchFunction = fetchCookie(fetch, this.#cookieJar);
        }
    }

    private async printCookies(url: string) {
        const cookies = await this.#cookieJar.getCookies(url);
        console.log('Cookies for', url);
        cookies.forEach((cookie) => {
            console.log(`- ${cookie.key}=${cookie.value}`);
        });
    }

    private async sendRequest(
        method: HttpMethod,
        uri: string,
        content: HttpContent | null = null,
        responseType: 'json' | 'text' | 'arrayBuffer' | null = null,
        additionalHeaders: Record<string, string> = {}
    ): Promise<HttpResponse> {
        const headers: Record<string, string> = {
            ...additionalHeaders,
        };

        const fetchOptions: RequestInit = {
            method,
            headers,
            credentials: 'include', // similar to xhr.withCredentials = true
        };

        if (content) {
            headers['Content-Type'] = content.type;
            fetchOptions.body = content.content;
        } else if (method === HttpMethod.POST) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            if (HttpClient.DUMP_COOKIES) {
                await this.printCookies(uri);
            }

            const response = await this.#fetchFunction(uri, fetchOptions);
            let data: any;
            switch (responseType) {
                case 'json':
                    data = await response.json();
                    break;
                case 'text':
                    data = await response.text();
                    break;
                case 'arrayBuffer':
                    data = await response.arrayBuffer();
                    break;
                default:
                    data = await response.text();
            }

            return new HttpResponse(response.status, response.headers, data);
        } catch (error: any) {
            return Promise.reject(new HttpResponse(0, null, error.message || error));
        }
    }

    get(
        uri: string,
        responseType: 'json' | 'text' | 'arrayBuffer' | null = null,
        additionalHeaders: Record<string, string> = {}
    ): Promise<HttpResponse> {
        return this.sendRequest(HttpMethod.GET, uri, null, responseType, additionalHeaders);
    }

    delete(uri: string, additionalHeaders: Record<string, string> = {}): Promise<HttpResponse> {
        return this.sendRequest(HttpMethod.DELETE, uri, null, null, additionalHeaders);
    }

    post(
        uri: string,
        content: HttpContent | null = null,
        responseType: 'json' | 'text' | 'arrayBuffer' | null = null,
        additionalHeaders: Record<string, string> = {}
    ): Promise<HttpResponse> {
        return this.sendRequest(HttpMethod.POST, uri, content, responseType, additionalHeaders);
    }

    put(
        uri: string,
        content: HttpContent | null = null,
        additionalHeaders: Record<string, string> = {}
    ): Promise<HttpResponse> {
        return this.sendRequest(HttpMethod.PUT, uri, content, null, additionalHeaders);
    }
}

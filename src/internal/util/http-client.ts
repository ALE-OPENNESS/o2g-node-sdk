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
import { IHttpClient } from './IHttpClient';
import { HttpContent } from './http-content';
import { HttpResponse } from './http-response';

const cookieJar = new CookieJar();

// Import node-fetch only if fetch is not available globally
let fetchFunction: typeof fetch;

// Node >= 18, use global fetch with cookie support
fetchFunction = fetchCookie(fetch, cookieJar);

enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

/** @internal */
export default class HttpClient implements IHttpClient {
    static DUMP_COOKIES: boolean = false;

    private async printCookies(url: string) {
        const cookies = await cookieJar.getCookies(url);
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

            // Wait for fetchFunction to resolve if dynamic import is used
            const fetchResolved = fetchFunction;

            const response = await fetchResolved(uri, fetchOptions);
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

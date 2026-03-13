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

/** @internal */
export default class UtilUri {
    static ensureHttps(uri: string): string {
        if (!uri) return uri;
        return uri.startsWith('http:') ? 'https:' + uri.slice(5) : uri;
    }

    static appendPath(uri: string, ...paths: string[]): string {
        if (!uri) return paths.join('/');

        // Remove trailing slash from uri if present
        const base = uri.endsWith('/') ? uri.slice(0, -1) : uri;

        // Clean paths to remove leading/trailing slashes
        const cleanPaths = paths.map((p) => p.replace(/^\/+|\/+$/g, ''));

        return [base, ...cleanPaths].join('/');
    }

    static appendQuery(uri: string, queryName: string, queryValue: string | null = null): string {
        if (!uri || !queryName) return uri;

        const separator = uri.includes('?') ? '&' : '?';

        if (queryValue === null) {
            return `${uri}${separator}${queryName}`;
        }

        try {
            const url = new URL(uri);
            url.searchParams.append(queryName, queryValue);
            return url.toString();
        } catch {
            return `${uri}${separator}${queryName}=${encodeURIComponent(queryValue)}`;
        }
    }

    static getBaseUri(uri: string): string {
        const url = new URL(uri);
        const portPart = url.port ? `:${url.port}` : '';

        return `${url.protocol}//${url.hostname}${portPart}`;
    }
}

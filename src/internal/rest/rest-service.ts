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

import path from 'path';
import fs from 'fs/promises';
import { IHttpClient } from '../util/IHttpClient';
import { HttpResponse } from '../util/http-response';
import { FileUtil } from '../util/file-utils';

/** @internal */
export class RestService {
    protected _httpClient: IHttpClient;
    protected _uri: string;

    constructor(uri: string, httpClient: IHttpClient) {
        this._uri = uri;
        this._httpClient = httpClient;
    }

    getResult<Type>(httpResponse: HttpResponse): Type | null {
        if (httpResponse.isSuccessStatusCode()) {
            return httpResponse.fromJson();
        } else {
            return null;
        }
    }

    private getFilename(httpResponse: HttpResponse): string | null {
        if (httpResponse.headers) {
            const contentDisposition = httpResponse.headers.get('content-disposition');
            if (contentDisposition) {
                const match = /filename\*?=(?:UTF-8''|")?([^;\r\n"]+)/i.exec(contentDisposition);
                return match ? decodeURIComponent(match[1]) : null;
            }
        }
        return null;
    }

    async downloadFile(
        httpResponse: HttpResponse,
        filePath: string | null,
        extension: string | null = null
    ): Promise<string | null> {
        if (httpResponse.isSuccessStatusCode()) {
            if (httpResponse.response instanceof ArrayBuffer) {
                let downloadedFile = filePath;
                if (downloadedFile == null) {
                    let filename: string | null = this.getFilename(httpResponse);
                    if (filename) {
                        downloadedFile = path.join(FileUtil.getTempFolder(), filename);
                    } else {
                        downloadedFile = path.join(FileUtil.getTempFolder(), FileUtil.getRandomFilename(extension));
                    }
                }

                try {
                    const buffer: ArrayBuffer = httpResponse.response;
                    await fs.writeFile(downloadedFile, Buffer.from(buffer));

                    return downloadedFile;
                } catch (error) {
                    console.error(`Failed to write file to ${downloadedFile}:`, error);
                    throw new Error(`Failed to write file to ${downloadedFile}: ${error}`);
                }
            }
        }

        return null;
    }
}

/*
 * Copyright 2025 ALE International
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

import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns/format';
import * as path from 'path';

/** @internal */
export class FileUtil {
    static getTempFolder(): string {
        return os.tmpdir();
    }

    static getRandomFilename(extension: string | null): string {
        if (extension) {
            return `${Date.now()}-${uuidv4()}${extension}`;
        } else {
            return `${Date.now()}-${uuidv4()}`;
        }
    }

    static withTimestamp(directory: string, fileName: string): string {
        // Split name and extension
        const parsed = path.parse(fileName);
        const name = parsed.name;
        const extension = parsed.ext;

        // Format timestamp: yyyyMMdd-HHmmss
        const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');

        // Build new filename
        const newFileName = `${name}-${timestamp}${extension}`;

        // Resolve against directory
        return path.join(directory, newFileName);
    }
}

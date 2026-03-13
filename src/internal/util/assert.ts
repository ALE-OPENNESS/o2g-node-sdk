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
export class AssertUtil {
    static notEmpty<T>(arr: T[] | null | undefined, name: string): T[] {
        if (!arr || arr.length === 0) {
            throw new Error(`InvalidArgument: ${name} must not be null or empty`);
        }
        return arr;
    }

    static notNullOrEmpty(str: string | null | undefined, name: string): string {
        if (str == null || str.trim().length === 0) {
            throw new Error(`InvalidArgument: ${name} must not be null or empty`);
        }
        return str as string;
    }

    static notNull<T>(obj: T | null | undefined, name: string): T {
        if (obj == null) {
            throw new Error(`InvalidArgument: ${name} must not be null`);
        }
        return obj as T;
    }

    static positive(value: number | null, name: string): number {
        if (value == null || value < 0) {
            throw new Error(`InvalidArgument: ${name} must be positive`);
        }
        return value;
    }

    static positiveStrict(value: number | null, name: string): number {
        if (value == null || value <= 0) {
            throw new Error(`InvalidArgument: ${name} must be strict positive`);
        }
        return value;
    }
}

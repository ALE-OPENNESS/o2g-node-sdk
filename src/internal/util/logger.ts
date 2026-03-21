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

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    NONE = 'NONE',
}

const LogLevelPriority: Record<LogLevel, number> = {
    [LogLevel.DEBUG]: 0,
    [LogLevel.INFO]: 1,
    [LogLevel.WARN]: 2,
    [LogLevel.ERROR]: 3,
    [LogLevel.NONE]: 4,
};

export interface LoggerOptions {
    level?: LogLevel;
    useColors?: boolean;
    showTimestamp?: boolean;
    useLocalTime?: boolean;
}

const defaultOptions: Required<LoggerOptions> = {
    level: LogLevel.NONE,
    useColors: true,
    showTimestamp: true,
    useLocalTime: false,
};

type Transport = (level: LogLevel, message: string, meta?: unknown[]) => void;

const isBrowser = typeof window !== 'undefined';

function defaultTransport(level: LogLevel, message: string, meta?: unknown[]) {
    const method =
        level === LogLevel.ERROR ? 'error' : level === LogLevel.WARN ? 'warn' : 'log';
    (console as any)[method](message, ...(meta || []));
}

export class Logger {
    private category: string;
    private options: Required<LoggerOptions>;
    private transport: Transport;

    constructor(category: string, options?: LoggerOptions, transport: Transport = defaultTransport) {
        this.category = category;
        this.options = { ...defaultOptions, ...options };
        this.transport = transport;
    }

    static create(category: string, options?: LoggerOptions): Logger {
        return new Logger(category, options);
    }

    /**
     * Check if the given log level is currently enabled.
     */
    isLevelEnabled(level: LogLevel): boolean {
        return LogLevelPriority[level] >= LogLevelPriority[this.options.level];
    }

    private shouldLog(level: LogLevel): boolean {
        return this.isLevelEnabled(level);
    }

    private getTimestamp(): string {
        return this.options.useLocalTime
            ? new Date().toLocaleString()
            : new Date().toISOString();
    }

    private formatMessage(level: LogLevel, message: string): string {
        let result = '';
        if (this.options.showTimestamp) {
            result += this.getTimestamp() + ' ';
        }
        result += `[${level}] ${this.category}: ${message}`;
        return result;
    }

    private formatBrowser(level: LogLevel, message: string): [string, string[]] {
        const colors: Record<LogLevel, string> = {
            DEBUG: 'color: cyan',
            INFO: 'color: green',
            WARN: 'color: orange',
            ERROR: 'color: red',
            NONE: '',
        };

        let msg = '';
        const styles: string[] = [];

        if (this.options.showTimestamp) {
            msg += '%c' + this.getTimestamp() + ' ';
            styles.push('color: grey');
        }

        msg += '%c[' + level + '] ';
        styles.push(colors[level]);

        msg += '%c' + this.category + ': ';
        styles.push('font-weight: bold');

        msg += '%c' + message;
        styles.push('');

        return [msg, styles];
    }

    private write(level: LogLevel, message: string, meta?: unknown[]) {
        if (!this.shouldLog(level)) return;

        let displayMessage = message;
        if (meta && meta.length > 0) {
            const metaStr = meta
                .map(m => (typeof m === 'object' ? JSON.stringify(m) : String(m)))
                .join(' ');
            displayMessage += ' ' + metaStr;
        }

        if (isBrowser && this.options.useColors) {
            const [msg, styles] = this.formatBrowser(level, displayMessage);
            this.transport(level, msg, [...styles, ...(meta || [])]);
        } else {
            const formatted = this.formatMessage(level, displayMessage);
            this.transport(level, formatted, meta);
        }
    }

    private interpolate(format: string, args: unknown[]): string {
        let i = 0;
        return format.replace(/\{\}/g, () => String(args[i++]));
    }

    debug(format: string, ...args: unknown[]) {
        this.write(LogLevel.DEBUG, this.interpolate(format, args), args);
    }

    info(format: string, ...args: unknown[]) {
        this.write(LogLevel.INFO, this.interpolate(format, args), args);
    }

    warn(format: string, ...args: unknown[]) {
        this.write(LogLevel.WARN, this.interpolate(format, args), args);
    }

    error(format: string, ...args: unknown[]) {
        this.write(LogLevel.ERROR, this.interpolate(format, args), args);
    }

    child(sub: string): Logger {
        return new Logger(`${this.category}:${sub}`, this.options, this.transport);
    }

    setLevel(level: LogLevel) {
        this.options.level = level;
    }
}

export const httpTransport: Transport = (level, message, meta) => {
    fetch('/logs', {
        method: 'POST',
        body: JSON.stringify({ level, message, meta }),
        headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
};

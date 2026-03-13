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
export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    NONE = 'NONE',
}

/** @internal */
export enum Color {
    Black = 0,
    Red = 1,
    Green = 2,
    Yellow = 3,
    Blue = 4,
    Magenta = 5,
    Cyan = 6,
    Grey = 7,
    White = 9,
    Default = 9,
}

let GlobalLogLevel: LogLevel = LogLevel.DEBUG;

const logLevelColors: Color[] = [
    Color.Cyan, // DEBUG
    Color.Green, // INFO
    Color.Yellow, // WARN
    Color.Red, // ERROR
    Color.Default, // NONE
];

/** @internal */
interface LoggerOptions {
    useColors?: boolean;
    color?: Color;
    showTimestamp?: boolean;
    useLocalTime?: boolean;
    showLevel?: boolean;
}

/** @internal */
const defaultOptions: Required<LoggerOptions> = {
    useColors: false,
    color: Color.Default,
    showTimestamp: true,
    useLocalTime: false,
    showLevel: true,
};

/** @internal */
export class Logger {
    private category: string;
    private options: Required<LoggerOptions>;

    constructor(category: string, options?: LoggerOptions) {
        this.category = category;
        this.options = { ...defaultOptions, ...options };
    }

    debug(format: string, ...args: unknown[]): void {
        if (this._shouldLog(LogLevel.DEBUG)) this._write(LogLevel.DEBUG, this._formatText(format, args));
    }

    log(format: string, ...args: unknown[]): void {
        if (this._shouldLog(LogLevel.DEBUG)) this.debug(format, ...args);
    }

    info(format: string, ...args: unknown[]): void {
        if (this._shouldLog(LogLevel.INFO)) this._write(LogLevel.INFO, this._formatText(format, args));
    }

    warn(format: string, ...args: unknown[]): void {
        if (this._shouldLog(LogLevel.WARN)) this._write(LogLevel.WARN, this._formatText(format, args));
    }

    error(format: string, ...args: unknown[]): void {
        if (this._shouldLog(LogLevel.ERROR)) this._write(LogLevel.ERROR, this._formatText(format, args));
    }

    private _shouldLog(level: LogLevel): boolean {
        const logLevels = Object.values(LogLevel);
        const currentLevel =
            typeof window !== 'undefined' && (window as any).LOG ? (window as any).LOG.toUpperCase() : GlobalLogLevel;
        return logLevels.indexOf(level) >= logLevels.indexOf(currentLevel as LogLevel);
    }

    private _formatText(format: string, args: unknown[]): string {
        let i = 0;
        return format.replace(/\{\w+\}/g, () => {
            return i < args.length ? String(args[i++]) : '';
        });
    }

    private _write(level: LogLevel, text: string): void {
        const format = this._format(level, text);
        const formattedText = this._createLogMessage(level, text, format);

        const output = level === LogLevel.ERROR ? console.error : console.log;

        const parts: any[] = [];

        if (this.options.useColors) {
            if (this.options.showTimestamp) parts.push(format.timestamp, this._getTimestamp());
            if (this.options.showLevel) parts.push(format.level, `[${level}]`);
            parts.push(format.category, this.category);
            parts.push(format.text, text);
        } else {
            let line = '';
            if (this.options.showTimestamp) line += this._getTimestamp() + ' ';
            if (this.options.showLevel) line += `[${level}] `;
            line += `${this.category}: ${text}`;
            parts.push(line);
        }

        output(...parts);
    }

    private _format(level: LogLevel, text: string): Record<string, string> {
        const levelIndex = Object.values(LogLevel).indexOf(level);
        const levelColor = logLevelColors[levelIndex] ?? Color.Default;

        return {
            timestamp: this.options.useColors && this.options.showTimestamp ? `color:${Color.Grey}` : '',
            level: this.options.useColors && this.options.showLevel ? `color:${levelColor}` : '',
            category: this.options.useColors ? `color:${this.options.color}; font-weight:bold` : '',
            text: ': ',
        };
    }

    private _createLogMessage(level: LogLevel, text: string, format: Record<string, string>): string {
        let result = '';

        if (this.options.showTimestamp) {
            result += this._getTimestamp() + ' ';
        }

        if (this.options.showLevel) {
            result += `[${level}] `;
        }

        result += `${this.category}: ${text}`;
        return result;
    }

    private _getTimestamp(): string {
        return this.options.useLocalTime ? new Date().toLocaleString() : new Date().toISOString();
    }

    static create(category: string, options?: LoggerOptions): Logger {
        return new Logger(category, options);
    }
}

/* Public API */
export default {
    Colors: Color,
    LogLevels: LogLevel,
    setLogLevel: (level: LogLevel) => {
        GlobalLogLevel = level;
    },
    /*
    ,
    create: (category: string, options?: LoggerOptions): Logger => {
        return new Logger(category, options);
    },
    */
};

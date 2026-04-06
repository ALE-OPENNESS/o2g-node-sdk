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

import { injectable } from 'inversify';
import EventEmitter from 'events';
import { EventDispatcher, EventMap } from '../types/events/events';

// Adapter functions
/** @internal */
export type EventAdapter<Name extends keyof EventMap> = (eventData: any) => EventMap[Name];

/** @internal */
type EventClass<T> = {
    fromJson(json: any): T;
};

/** @internal */
export interface EventRegistry {
    register<Name extends keyof EventMap>(
        emitter: EventEmitter,
        eventName: Name,
        eventClass: EventClass<EventMap[Name]>
    ): void;
}


/** @internal */
export interface IEventSink extends EventDispatcher, EventRegistry {}

/** @internal */
@injectable()
export class EventSink implements IEventSink {
    private _emitters = new Map<keyof EventMap, EventEmitter>();
    private _eventClasses = new Map<keyof EventMap, EventClass<any>>();

    register<Name extends keyof EventMap>(
        emitter: EventEmitter,
        eventName: Name,
        eventClass: EventClass<EventMap[Name]>
    ): void {
        this._emitters.set(eventName, emitter);
        this._eventClasses.set(eventName, eventClass);
    }

    dispatch(event: { eventName: keyof EventMap; [key: string]: any }): void {
        const eventName = event.eventName;
        const emitter = this._emitters.get(eventName);
        const eventClass = this._eventClasses.get(eventName);

        if (!emitter || !eventClass) return;

        const payload = eventClass.fromJson(event);
        emitter.emit(eventName, payload);
    }
}

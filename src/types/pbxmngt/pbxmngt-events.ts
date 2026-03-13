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

import { OnPbxObjectInstanceEventJson, PbxObjectDefinitionJson } from '../../internal/types/pbxmngt/pbxmngt-types';

/**
 * Represents a PBX object definition.
 *
 * A PBX object is identified by:
 * - a unique object identifier
 * - a logical object name
 */
export class PbxObjectDefinition {
    #objectName: string;
    #objectId: string;

    /**
     * @internal
     */
    private constructor(objectName: string, objectId: string) {
        this.#objectName = objectName;
        this.#objectId = objectId;
    }

    /**
     * Gets the logical name of the PBX object.
     *
     * @returns The object name.
     */
    get objectName(): string {
        return this.#objectName;
    }

    /**
     * Gets the unique identifier of the PBX object.
     *
     * @returns The object identifier.
     */
    get objectId(): string {
        return this.#objectId;
    }

    /**
     * @internal
     */
    static fromJson(json: PbxObjectDefinitionJson): PbxObjectDefinition {
        return new PbxObjectDefinition(json.objectName, json.objectId);
    }
}

/**
 * Base class for PBX object instance lifecycle events.
 *
 * This abstract class represents a generic event emitted when a PBX object
 * instance is created, modified, or deleted.
 */
export abstract class OnPbxObjectInstanceEvent {
    #object: PbxObjectDefinition;
    #parent?: PbxObjectDefinition;
    #nodeId: number;

    /**
     * Creates a new PBX object instance event.
     *
     * @param object - The PBX object concerned by the event.
     * @param parent - The parent object (if any).
     * @param nodeId - Identifier of the OmniPCX Enterprise node that emitted the event.
     */
    protected constructor(object: PbxObjectDefinition, parent: PbxObjectDefinition | undefined, nodeId: number) {
        this.#object = object;
        this.#parent = parent;
        this.#nodeId = nodeId;
    }

    /**
     * Gets the PBX object concerned by the event.
     *
     * @returns The object definition.
     */
    get object(): PbxObjectDefinition {
        return this.#object;
    }

    /**
     * Gets the parent object of the concerned PBX object.
     *
     * @returns The parent object definition, or `null` if none exists.
     */
    get parent(): PbxObjectDefinition | null {
        return this.#parent ?? null;
    }

    /**
     * Gets the identifier of the OmniPCX Enterprise node
     * that emitted this event.
     *
     * @returns The node identifier.
     */
    get nodeId(): number {
        return this.#nodeId;
    }
}

/**
 * Event emitted when a PBX object instance is created.
 */
export class OnPbxObjectInstanceCreated extends OnPbxObjectInstanceEvent {
    /**
     * @param object - The created PBX object.
     * @param parent - The parent object (if any).
     * @param nodeId - Identifier of the emitting node.
     */
    /**
     * @internal
     */
    private constructor(object: PbxObjectDefinition, parent: PbxObjectDefinition | undefined, nodeId: number) {
        super(object, parent, nodeId);
    }

    /**
     * @internal
     */
    static fromJson(json: OnPbxObjectInstanceEventJson): OnPbxObjectInstanceCreated {
        return new OnPbxObjectInstanceCreated(
            PbxObjectDefinition.fromJson(json),
            json.father ? PbxObjectDefinition.fromJson(json.father) : undefined,
            Number(json.nodeId)
        );
    }
}

/**
 * Event emitted when a PBX object instance is deleted.
 */
export class OnPbxObjectInstanceDeleted extends OnPbxObjectInstanceEvent {
    /**
     * @internal
     */
    private constructor(object: PbxObjectDefinition, parent: PbxObjectDefinition | undefined, nodeId: number) {
        super(object, parent, nodeId);
    }

    /**
     * @internal
     */
    static fromJson(json: OnPbxObjectInstanceEventJson): OnPbxObjectInstanceDeleted {
        return new OnPbxObjectInstanceDeleted(
            PbxObjectDefinition.fromJson(json),
            json.father ? PbxObjectDefinition.fromJson(json.father) : undefined,
            Number(json.nodeId)
        );
    }
}

/**
 * Event emitted when a PBX object instance is modified.
 */
export class OnPbxObjectInstanceModified extends OnPbxObjectInstanceEvent {
    /**
     * @internal
     */
    private constructor(object: PbxObjectDefinition, parent: PbxObjectDefinition | undefined, nodeId: number) {
        super(object, parent, nodeId);
    }

    /**
     * @internal
     */
    static fromJson(json: OnPbxObjectInstanceEventJson): OnPbxObjectInstanceModified {
        return new OnPbxObjectInstanceModified(
            PbxObjectDefinition.fromJson(json),
            json.father ? PbxObjectDefinition.fromJson(json.father) : undefined,
            parseInt(json.nodeId)
        );
    }
}

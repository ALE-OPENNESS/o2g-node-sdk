/*
 * Copyright 2026 ALE International
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
export type AttributeModelJson = {
    name?: string;
    mandatory?: boolean;
    typeValue?: string;
    multiValue?: boolean;
    allowedValues?: string[];
    lengthValue?: string;
    defaultValue?: string;
    filtering?: boolean;
    usedWhen?: string;
};

/** @internal */
export type ObjectModelJson = {
    objectName?: string;
    attributes?: AttributeModelJson[];
    objects?: ObjectModelJson[];
    hidden?: boolean;
    create?: boolean;
    delete?: boolean;
    set?: boolean;
    get?: boolean;
    otherActions?: string[];
};

/** @internal */
export type PbxComplexAttributeJson = {
    name?: string;
    attributes?: PbxAttributeJson[];
};

/** @internal */
export type PbxAttributeJson = {
    name?: string;
    value?: string[];
    complexValue?: PbxComplexAttributeJson[];
};

/** @internal */
export type PbxObjectJson = {
    objectName?: string;
    objectId?: string;
    attributes?: PbxAttributeJson[];
    objectNames?: string[];
};

/** @internal */
export type PbxObjectIdsJson = {
    objectIds: string[];
};

/**
 * Pbx represents basic information of a Pbx (OmniPCX Enterprise).
 * In an OmniPcx Enterprise sub-network, each OXE node is identifier by a unique node id.
 */
/** @internal */
export type PbxJson = {
    /**
     * The OmniPcx Enterprise node id.
     */
    nodeId?: number;

    /**
     * The OmniPCX Enterprise node Fqdn.
     */
    fqdn?: string;
};

/**
 * Represent an OmniPCX Enterprise object definition.
 */
/** @internal */
export type PbxObjectDefinitionJson = {
    objectName: string;
    objectId: string;
};

/**
 * Represent an OmniPCX Enterprise object definition.
 */
/** @internal */
export type PbxObjectFatherJson = PbxObjectDefinitionJson;

/**
 * Notification sent when a PBX object instance is created? deleted, or modified. Only Object Subscriber is concerned by this event.
 * Same type for 3 notifications
 */
/** @internal */
export type OnPbxObjectInstanceEventJson = {
    objectName: string;
    objectId: string;
    nodeId: string;
    father?: PbxObjectFatherJson;
};

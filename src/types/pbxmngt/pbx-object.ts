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

import { PbxObjectJson } from '../../internal/types/pbxmngt/pbxmngt-types';
import { PbxAttribute } from './pbx-attribute';

/**
 * Represents an object instance in the OmniPCX Enterprise object model.
 * <p>
 * A `PbxObject` is referenced by its object instance definition — a hierarchical
 * path from the root object — and a unique instance id. For example:
 * <ul>
 * <li>`"Subscriber"` — a subscriber object</li>
 * <li>`"Application_Configuration/1/ACD2/1/ACD2_Operator/1/ACD2_Operator_data"` — a CCD operator data object</li>
 * </ul>
 * <p>
 * A `PbxObject` is returned by {@link PbxManagement.getObject} and
 * {@link PbxManagement.getNodeObject}. Its attributes can be accessed by name
 * using {@link getAttribute}, and its sub-object names are available via
 * {@link objectNames}.
 *
 * @example
 * ```typescript
 * // Retrieve a subscriber object
 * const obj = await O2G.pbxManagement.getObject(1, "Subscriber", "60200");
 *
 * // Read simple attributes
 * const stationType = obj?.getAttribute("StationType")?.asString();
 * const maxCalls    = obj?.getAttribute("MaxCalls")?.asInteger();
 * const enabled     = obj?.getAttribute("Enabled")?.asBoolean();
 *
 * // Read a sequence attribute
 * const skill = obj?.getAttribute("Skill")?.asAttributeMap();
 * const level = skill?.getAttribute("Skill_Level")?.asInteger();
 *
 * // Read a set of sequences
 * const skillSet = obj?.getAttribute("SkillSet");
 * const maps = skillSet?.asListOfMaps();
 * maps?.forEach(map => {
 *     console.log("Skill Nb:", map.getAttribute("Skill_Nb")?.asInteger());
 * });
 *
 * // List available sub-objects
 * console.log("Sub-objects:", obj?.objectNames);
 * ```
 */
export class PbxObject {
    #objectName?: string;
    #id?: string;
    #objectNames?: string[];
    #attributes?: Map<string, PbxAttribute>;

    /**
     * @internal
     */
    private constructor(
        objectName?: string,
        id?: string,
        objectNames?: string[],
        attributes?: Map<string, PbxAttribute>
    ) {
        this.#objectName = objectName;
        this.#id = id;
        this.#objectNames = objectNames;
        this.#attributes = attributes;
    }

    /**
     * Returns the names of sub-objects accessible from this object.
     * <p>
     * These names can be used to recursively navigate the object hierarchy
     * using {@link PbxManagement.getObject}.
     *
     * @returns the list of sub-object names, or `null` if none
     */
    get objectNames(): string[] | null {
        return this.#objectNames ?? null;
    }

    /**
     * Returns this object's name.
     *
     * @returns the object name, or `null` if undefined
     */
    get name(): string | null {
        return this.#objectName ?? null;
    }

    /**
     * Returns this object's instance id.
     *
     * @returns the instance id, or `null` if undefined
     */
    get id(): string | null {
        return this.#id ?? null;
    }

    /**
     * Returns the attribute with the specified name.
     *
     * @param attrName the name of the attribute to retrieve
     * @returns the {@link PbxAttribute} if found; `undefined` otherwise
     */
    getAttribute(attrName: string): PbxAttribute | undefined {
        return this.#attributes?.get(attrName);
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: PbxObjectJson): PbxObject {
        const mapAttributes = new Map<string, PbxAttribute>();

        if (json.attributes) {
            for (const attr of json.attributes) {
                const names = attr.name?.split('.') ?? [];

                if (names.length === 1 && attr.name) {
                    mapAttributes.set(attr.name, PbxAttribute.fromJson(attr));
                } else if (names.length > 1) {
                    if (!mapAttributes.has(names[0])) {
                        mapAttributes.set(names[0], new PbxAttribute(names[0]));
                    }

                    const parentAttr = mapAttributes.get(names[0]);
                    if (parentAttr) {
                        PbxAttribute.addSequenceAttribute(parentAttr, names[1], attr);
                    }
                }
            }
        }

        return new PbxObject(json.objectName, json.objectId, json.objectNames, mapAttributes);
    }
}

/*
 * Copyright 2022 ALE International
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

import { PbxAttributeJson, PbxComplexAttributeJson } from '../../internal/types/pbxmngt/pbxmngt-types';
import { PbxAttribute } from './pbx-attribute';

/**
 * Represents a collection of named {@link PbxAttribute} objects that together
 * form a structured sequence.
 * <p>
 * A `PbxAttributeMap` is used when building or reading back Sequence or Set
 * attributes. Each attribute in the map must have a unique name.
 * <p>
 * Use {@link PbxAttributeMap.create} or {@link PbxAttributeMap.createWith} to
 * build a map, then pass it to {@link PbxAttribute.createSequence} or
 * {@link PbxAttribute.createSequenceSet}.
 *
 * @example
 * ```typescript
 * // Build a sequence using the fluent API
 * const skillMap = PbxAttributeMap.create()
 *     .add(PbxAttribute.createInteger("Skill_Nb", 1))
 *     .add(PbxAttribute.createInteger("Skill_Level", 3))
 *     .add(PbxAttribute.createBoolean("Skill_Activate", true));
 *
 * // Or build it from an array
 * const skillMap2 = PbxAttributeMap.createWith([
 *     PbxAttribute.createInteger("Skill_Nb", 1),
 *     PbxAttribute.createInteger("Skill_Level", 3),
 *     PbxAttribute.createBoolean("Skill_Activate", true)
 * ]);
 *
 * // Use it to create a Sequence attribute
 * const skill = PbxAttribute.createSequence("Skill", skillMap);
 *
 * // Or a Set of sequences
 * const skillSet = PbxAttribute.createSequenceSet("SkillSet", [skillMap, skillMap2]);
 * ```
 */
export class PbxAttributeMap {
    #attributes: Map<string, PbxAttribute>;

    /**
     * @internal
     */
    constructor() {
        this.#attributes = new Map<string, PbxAttribute>();
    }

    /**
     * Returns the names of all attributes in this map.
     *
     * @returns the list of attribute names
     */
    get names(): string[] {
        return Array.from(this.#attributes.keys());
    }

    /**
     * Returns the attribute with the specified name.
     *
     * @param name the name of the attribute to retrieve
     * @returns the {@link PbxAttribute} if found; `undefined` otherwise
     */
    getAttribute(name: string): PbxAttribute | undefined {
        return this.#attributes.get(name);
    }

    /**
     * Adds an attribute to this map.
     * <p>
     * Attributes with undefined names are skipped. Calls can be chained to
     * build a sequence fluently.
     *
     * @param value the attribute to add
     * @returns this {@link PbxAttributeMap} for chaining
     * @see create
     */
    add(value: PbxAttribute): PbxAttributeMap {
        if (value.name) {
            this.#attributes.set(value.name, value);
        } else {
            console.warn('Skipped attribute with undefined name', value);
        }
        return this;
    }

    /**
     * Creates a new empty `PbxAttributeMap`.
     * <p>
     * Use the fluent {@link add} method to populate it.
     *
     * @example
     * ```typescript
     * const map = PbxAttributeMap.create()
     *     .add(PbxAttribute.createInteger("Param1", 1))
     *     .add(PbxAttribute.createBoolean("Param2", true));
     * ```
     *
     * @returns a new empty {@link PbxAttributeMap}
     * @see createWith
     */
    static create(): PbxAttributeMap {
        return new PbxAttributeMap();
    }

    /**
     * Creates a `PbxAttributeMap` pre-populated with the specified attributes.
     * <p>
     * Attributes with undefined names are skipped.
     *
     * @example
     * ```typescript
     * const map = PbxAttributeMap.createWith([
     *     PbxAttribute.createInteger("Param1", 1),
     *     PbxAttribute.createBoolean("Param2", true)
     * ]);
     * ```
     *
     * @param attributes the list of attributes to add
     * @returns a new {@link PbxAttributeMap} containing the specified attributes
     * @see create
     */
    static createWith(attributes: PbxAttribute[]): PbxAttributeMap {
        const map = new PbxAttributeMap();

        attributes.forEach((attr) => {
            if (attr.name) {
                map.#attributes.set(attr.name, attr);
            } else {
                console.warn('Skipped attribute with undefined name', attr);
            }
        });

        return map;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: PbxComplexAttributeJson): PbxAttributeMap {
        const mapAttributes = new PbxAttributeMap();

        if (json.attributes) {
            json.attributes.forEach((attr) => {
                if (attr.name) {
                    mapAttributes.#attributes.set(attr.name, PbxAttribute.fromJson(attr));
                } else {
                    console.warn('Skipped attribute with undefined name', attr);
                }
            });
        }

        return mapAttributes;
    }

    /**
     * @internal
     */
    /** @internal */

    static toJson(attributeMaps: PbxAttributeMap, attrName?: string): PbxComplexAttributeJson {
        const o2gPbxAttributes: PbxAttributeJson[] = [];
        attributeMaps.names.forEach((name) => {
            const attr = attributeMaps.getAttribute(name);
            if (attr) {
                o2gPbxAttributes.push(...PbxAttribute.toJson(attr));
            }
        });

        return {
            name: attrName,
            attributes: o2gPbxAttributes,
        };
    }
}

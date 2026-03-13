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

import { PbxAttributeJson } from '../../internal/types/pbxmngt/pbxmngt-types';
import { PbxAttributeMap } from './pbx-attr-map';

/**
 * Represents an attribute in a {@link PbxObject}.
 *
 * <p>
 * A PbxAttribute can be of the following types:
 * </p>
 *
 * <ul>
 *   <li><b>Integer</b>: Equivalent to a number value.</li>
 *   <li><b>Boolean</b>: Equivalent to a boolean value.</li>
 *   <li><b>Enumerated</b>: Limited set of string values.</li>
 *   <li><b>OctetString / ByteString</b>: Treated as a string value.</li>
 *   <li><b>Sequence</b>: Structured data with named attributes. Example:
 *   <pre>{@code
 *     Skill := Sequence {
 *         Skill_Nb := Integer,
 *         Skill_Level := Integer,
 *         Skill_Activate := Boolean
 *     }
 *   }</pre>
 *   </li>
 *   <li><b>Set</b>: List of attributes of the same type, either simple or sequences. Examples:
 *   <pre>{@code
 *     SimpleSet := Set { Item := OctetString }
 *     SkillSet := Set { Item := Sequence {
 *         Skill_Nb := Integer,
 *         Skill_Level := Integer,
 *         Skill_Activate := Boolean
 *     }}
 *   }</pre>
 *   </li>
 * </ul>
 */
export class PbxAttribute {
    #name?: string;
    #values?: string[] = [];
    #attributeMaps: PbxAttributeMap[] | null = null;
    #sequenceMap: PbxAttributeMap | null = null;

    /**
     * @internal
     * @param name - Optional attribute name
     */
    constructor(name?: string) {
        this.#name = name;
    }

    /**
     * Returns this attribute's name.
     * @returns The attribute name, or null if not set
     */
    get name(): string | null {
        return this.#name ?? null;
    }

    /**
     * Creates a PbxAttribute from JSON.
     * @param json - The {@link PbxAttributeJson} representation
     * @returns A new {@link PbxAttribute} instance
     * @ignore
     */
    /** @internal */

    static fromJson(json: PbxAttributeJson): PbxAttribute {
        const attribute = new PbxAttribute(json.name);
        attribute.#values = json.value ?? [];

        if (json.complexValue) {
            attribute.#attributeMaps = json.complexValue.map(PbxAttributeMap.fromJson);
        }

        return attribute;
    }

    /**
     * Adds a nested sequence attribute.
     * @param pbxAttribute - The parent attribute
     * @param name - Name of the nested attribute
     * @param json - JSON representation of the nested attribute
     * @ignore
     */
    static addSequenceAttribute(pbxAttribute: PbxAttribute, name: string, json: PbxAttributeJson): void {
        if (!pbxAttribute.#sequenceMap) {
            pbxAttribute.#sequenceMap = new PbxAttributeMap();
        }

        const attribute = new PbxAttribute(name);
        attribute.#values = json.value ?? [];

        pbxAttribute.#sequenceMap.add(attribute);
    }

    /**
     * Creates a new PbxAttribute representing a Set of string values.
     * @param attrName - Attribute name
     * @param values - List of string values
     * @returns A new {@link PbxAttribute} instance
     */
    static createSetOfStrings(attrName: string, values: string[]): PbxAttribute {
        const attribute = new PbxAttribute(attrName);
        attribute.#values = values;
        return attribute;
    }

    /**
     * Creates a new PbxAttribute of type String.
     * @param attrName - Attribute name
     * @param value - String value
     * @returns A new {@link PbxAttribute} instance
     */
    static createString(attrName: string, value: string): PbxAttribute {
        const attribute = new PbxAttribute(attrName);
        attribute.#values = [value];
        return attribute;
    }

    /**
     * Creates a new PbxAttribute of type Boolean.
     * @param attrName - Attribute name
     * @param value - Boolean value
     * @returns A new {@link PbxAttribute} instance
     */
    static createBoolean(attrName: string, value: boolean): PbxAttribute {
        const attribute = new PbxAttribute(attrName);
        attribute.#values = [value ? 'true' : 'false'];
        return attribute;
    }

    /**
     * Creates a new PbxAttribute of type Integer.
     * @param attrName - Attribute name
     * @param value - Integer value
     * @returns A new {@link PbxAttribute} instance
     */
    static createInteger(attrName: string, value: number): PbxAttribute {
        const attribute = new PbxAttribute(attrName);
        attribute.#values = [value.toString()];
        return attribute;
    }

    /**
     * Creates a new PbxAttribute representing a Sequence.
     * @param attrName - Attribute name
     * @param sequence - {@link PbxAttributeMap} representing the sequence
     * @returns A new {@link PbxAttribute} instance
     */
    static createSequence(attrName: string, sequence: PbxAttributeMap): PbxAttribute {
        const attribute = new PbxAttribute(attrName);
        attribute.#sequenceMap = sequence;
        return attribute;
    }

    /**
     * Creates a new PbxAttribute representing a Set of sequences.
     * @param attrName - Attribute name
     * @param setOfSequences - List of {@link PbxAttributeMap} representing sequences
     * @returns A new {@link PbxAttribute} instance
     */
    static createSequenceSet(attrName: string, setOfSequences: PbxAttributeMap[]): PbxAttribute {
        const attribute = new PbxAttribute(attrName);
        attribute.#attributeMaps = setOfSequences;
        return attribute;
    }

    /**
     * Returns the attribute at the specified index in a Set of sequences.
     * @param index - Index of the set
     * @returns {@link PbxAttributeMap} at the specified index
     * @throws Error if the attribute is not a Set
     */
    getAt(index: number): PbxAttributeMap {
        if (!this.#attributeMaps || !Array.isArray(this.#attributeMaps)) {
            throw new Error('InvalidObject: Attribute is not a Set');
        }

        return this.#attributeMaps[index];
    }

    /**
     * Returns this attribute as a sequence of attributes.
     * @returns {@link PbxAttributeMap} representing the sequence
     * @throws Error if the attribute is not a Sequence
     */
    asAttributeMap(): PbxAttributeMap {
        if (!this.#sequenceMap) {
            throw new Error('InvalidObject: Attribute is not a sequence');
        }
        return this.#sequenceMap;
    }

    /**
     * Returns this attribute as a list of {@link PbxAttributeMap}.
     * @returns List of {@link PbxAttributeMap} representing a Set of sequences
     * @throws Error if the attribute is not a sequence set
     */
    asListOfMaps(): PbxAttributeMap[] {
        if (!this.#attributeMaps) {
            throw new Error('InvalidObject: Attribute is not a sequence set');
        }
        return this.#attributeMaps;
    }

    /**
     * Returns this attribute value as a boolean.
     * @returns Boolean value
     * @throws Error if value is not a valid boolean
     */
    asBoolean(): boolean {
        const value = this._assertUnique(this.#values);

        if (value === 'true') return true;
        if (value === 'false') return false;

        throw new Error(`Value "${value}" is not a boolean`);
    }

    /**
     * Sets this attribute value as a boolean.
     * @param value - Boolean value
     */
    setBoolean(value: boolean): void {
        this.#values = [value ? 'true' : 'false'];
        this.#sequenceMap = null;
        this.#attributeMaps = null;
    }

    /**
     * Returns this attribute value as an integer.
     * @returns Integer value
     * @throws Error if value is not a valid integer
     */
    asInteger(): number {
        const value = this._assertUnique(this.#values);
        const num = parseInt(value, 10);
        if (isNaN(num)) {
            throw new Error(`InvalidObject: Value "${value}" is not a valid integer`);
        }
        return num;
    }

    /**
     * Sets this attribute value as an integer.
     * @param value - Integer value
     */
    setInteger(value: number): void {
        this.#values = [value.toString()];
        this.#sequenceMap = null;
        this.#attributeMaps = null;
    }

    /**
     * Returns this attribute value as a string.
     * @returns String value
     */
    asString(): string {
        return this._assertUnique(this.#values);
    }

    /**
     * Sets this attribute value as a string.
     * @param value - String value
     */
    setString(value: string): void {
        this.#values = [value];
        this.#sequenceMap = null;
        this.#attributeMaps = null;
    }

    /**
     * Returns this attribute value as an enumerated string.
     * @returns String value
     */
    asEnum(): string {
        return this.asString();
    }

    /**
     * Ensures the attribute has a single value and returns it.
     * @param values - Array of string values
     * @returns The single string value
     * @throws Error if values array does not contain exactly one element
     */
    private _assertUnique(values: string[] | undefined): string {
        if (Array.isArray(values) && values.length === 1) {
            return values[0];
        }
        throw new Error('Value is not a list with a unique element');
    }

    /**
     * Serializes the PbxAttribute to JSON.
     * @param attr - The attribute to serialize
     * @returns Array of {@link PbxAttributeJson} objects
     * @ignore
     */
    /** @internal */

    static toJson(attr: PbxAttribute): PbxAttributeJson[] {
        const listAttr: PbxAttributeJson[] = [];

        if (attr.#sequenceMap) {
            for (const name of attr.#sequenceMap.names) {
                const nestedAttr = attr.#sequenceMap.getAttribute(name);
                if (nestedAttr) {
                    listAttr.push({
                        name: `${attr.name}.${name}`,
                        value: nestedAttr.#values,
                    });
                }
            }
        } else if (attr.#attributeMaps) {
            listAttr.push({
                name: attr.name ?? undefined,
                value: attr.#values,
                complexValue: attr.#attributeMaps.map((attrMap) =>
                    PbxAttributeMap.toJson(attrMap, attr.name ?? undefined)
                ),
            });
        } else {
            listAttr.push({
                name: attr.name ?? undefined,
                value: attr.#values,
            });
        }

        return listAttr;
    }
}

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

import { AttributeModelJson, ObjectModelJson } from '../../internal/types/pbxmngt/pbxmngt-types';
import { OctetStringLength } from './octet-string-length';

/**
 * Represents the object model of an OmniPCX Enterprise object.
 * <p>
 * A `Model` provides the metadata of an object in the PBX object hierarchy,
 * including:
 * <ul>
 * <li>which operations are permitted (create, delete, set, get)</li>
 * <li>the list of attributes with their types, constraints and allowed values</li>
 * <li>the list of child object models accessible from this object</li>
 * </ul>
 * <p>
 * Use {@link PbxManagement.getObjectModel} to retrieve a model, then inspect
 * its attributes and children before performing create or modify operations.
 *
 * @example
 * ```typescript
 * // Retrieve the model for the Subscriber object
 * const model = await O2G.pbxManagement.getObjectModel(1, "Subscriber");
 *
 * // Check what operations are allowed
 * console.log("Can create:", model?.canCreate);
 * console.log("Can delete:", model?.canDelete);
 *
 * // List all attributes and their types
 * model?.attributes().forEach(attr => {
 *     console.log(`${attr.name} (${attr.type}) mandatory=${attr.mandatory}`);
 *     if (attr.allowedValues) {
 *         console.log("  Allowed values:", attr.allowedValues);
 *     }
 * });
 *
 * // Check if an attribute supports filtering
 * const stationType = model?.attribute("StationType");
 * if (stationType?.filtering) {
 *     const filter = InstanceFilter.create("StationType", AttributeFilter.Equals, "ANALOG");
 *     const ids = await O2G.pbxManagement.getObjectInstances(1, "Subscriber", filter);
 * }
 * ```
 */
export class Model {
    #name?: string;
    #hidden?: boolean;
    #canCreate?: boolean;
    #canDelete?: boolean;
    #canSet?: boolean;
    #canGet?: boolean;
    #otherActions?: string[];
    #attributes: Map<string, Model.Attribute>;
    #children: Map<string, Model>;

    /**
     * @internal
     */
    private constructor(
        name?: string,
        hidden?: boolean,
        canCreate?: boolean,
        canDelete?: boolean,
        canSet?: boolean,
        canGet?: boolean,
        otherActions?: string[],
        attributes?: Map<string, Model.Attribute>,
        children?: Map<string, Model>
    ) {
        this.#name = name;
        this.#hidden = hidden;
        this.#canCreate = canCreate;
        this.#canDelete = canDelete;
        this.#canSet = canSet;
        this.#canGet = canGet;
        this.#otherActions = otherActions ?? [];
        this.#attributes = attributes ?? new Map();
        this.#children = children ?? new Map();
    }

    /**
     * Returns the name of this object model.
     *
     * @returns the object model name, or `null` if undefined
     */
    get name(): string | null {
        return this.#name ?? null;
    }

    /**
     * Returns the specified attribute model by name.
     *
     * @param attrName the attribute name
     * @returns the {@link Model.Attribute} or `null` if no attribute exists with this name
     */
    attribute(attrName: string): Model.Attribute | null {
        return this.#attributes.get(attrName) ?? null;
    }

    /**
     * Returns all attribute models for this object.
     *
     * @returns the list of {@link Model.Attribute} objects
     */
    attributes(): Model.Attribute[] {
        return Array.from(this.#attributes.values());
    }

    /**
     * Returns all child object models of this model.
     *
     * @returns the list of child {@link Model} objects
     */
    children(): Model[] {
        return Array.from(this.#children.values());
    }

    /**
     * Returns the specified child model by name.
     *
     * @param name the child model name
     * @returns the child {@link Model}, or `null` if no child exists with this name
     */
    child(name: string): Model | null {
        return this.#children.get(name) ?? null;
    }

    /**
     * Returns whether this object is hidden in the model.
     *
     * @returns `true` if the object is hidden; `false` otherwise
     */
    get hidden(): boolean {
        return this.#hidden ?? false;
    }

    /**
     * Returns whether this object can be created.
     *
     * @returns `true` if the object can be created; `false` otherwise
     */
    get canCreate(): boolean {
        return this.#canCreate ?? false;
    }

    /**
     * Returns whether this object can be deleted.
     *
     * @returns `true` if the object can be deleted; `false` otherwise
     */
    get canDelete(): boolean {
        return this.#canDelete ?? false;
    }

    /**
     * Returns whether this object can be modified.
     *
     * @returns `true` if the object can be set; `false` otherwise
     */
    get canSet(): boolean {
        return this.#canSet ?? false;
    }

    /**
     * Returns whether this object can be retrieved.
     *
     * @returns `true` if the object can be retrieved; `false` otherwise
     */
    get canGet(): boolean {
        return this.#canGet ?? false;
    }

    /**
     * Returns the additional actions available on this object beyond the standard
     * create, delete, set and get operations.
     *
     * @returns the list of additional action names, or `null` if none
     */
    get otherActions(): string[] | null {
        return this.#otherActions ?? null;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: ObjectModelJson): Model {
        const attributes = new Map(
            (json.attributes || [])
                .filter((attrJson) => attrJson.name !== undefined)
                .map((attrJson) => [attrJson.name!, Model.Attribute.fromJson(attrJson)])
        );

        const children = new Map(
            (json.objects || [])
                .filter((objJson) => objJson.objectName !== undefined)
                .map((objJson) => [objJson.objectName!, Model.fromJson(objJson)])
        );

        return new Model(
            json.objectName,
            json.hidden,
            json.create,
            json.delete,
            json.set,
            json.get,
            json.otherActions,
            attributes,
            children
        );
    }
}

export namespace Model {
    /**
     * Represents the possible types of a {@link Model.Attribute}.
     *
     * @see Model.Attribute
     */
    export enum AttributeType {
        /**
         * An enumerated type — a limited set of string values.
         */
        Enumerated = 'Enumerated',

        /**
         * An octet string type.
         */
        OctetString = 'OctetString',

        /**
         * A sequence of named sub-attributes.
         */
        Sequence = 'Sequence',

        /**
         * An integer type.
         */
        Integer = 'Integer',

        /**
         * A boolean type.
         */
        Boolean = 'Boolean',

        /**
         * A set of attributes of the same type.
         */
        Set = 'Set',

        /**
         * A byte string type.
         */
        ByteString = 'ByteString',
    }

    /**
     * Represents the model of a single attribute within a {@link Model} object.
     * <p>
     * Provides metadata about the attribute including its type, whether it is
     * mandatory, its allowed values or length constraints, and whether it can
     * be used in filters.
     */
    export class Attribute {
        #name?: string;
        #mandatory?: boolean;
        #multiValue?: boolean;
        #allowedValues?: string[];
        #octetStringLength?: OctetStringLength | null;
        #defaultValue?: string;
        #filtering?: boolean;
        #usedWhen?: string;
        #typeValue?: AttributeType;

        /**
         * @internal
         */
        private constructor(
            name?: string,
            mandatory?: boolean,
            typeValue?: AttributeType,
            multiValue?: boolean,
            allowedValues?: string[],
            octetStringLength?: OctetStringLength | null,
            defaultValue?: string,
            filtering?: boolean,
            usedWhen?: string
        ) {
            this.#name = name;
            this.#mandatory = mandatory;
            this.#typeValue = typeValue;
            this.#multiValue = multiValue;
            this.#allowedValues = allowedValues;
            this.#octetStringLength = octetStringLength;
            this.#defaultValue = defaultValue;
            this.#filtering = filtering;
            this.#usedWhen = usedWhen;
        }

        /**
         * Returns the name of this attribute.
         *
         * @returns the attribute name, or `null` if undefined
         */
        get name(): string | null {
            return this.#name ?? null;
        }

        /**
         * Returns whether this attribute is mandatory for object creation.
         *
         * @returns `true` if the attribute is mandatory; `false` otherwise
         */
        get mandatory(): boolean {
            return this.#mandatory ?? false;
        }

        /**
         * Returns the type of this attribute.
         *
         * @returns the {@link AttributeType}, or `null` if undefined
         */
        get type(): AttributeType | null {
            return this.#typeValue ?? null;
        }

        /**
         * Returns whether this attribute can hold multiple values.
         *
         * @returns `true` if the attribute is multi-value; `false` otherwise
         */
        get multiValue(): boolean {
            return this.#multiValue ?? false;
        }

        /**
         * Returns the allowed values for this attribute.
         * <p>
         * Only applies to attributes of type {@link AttributeType.Enumerated}.
         *
         * @returns the list of allowed values, or `null` if unrestricted
         */
        get allowedValues(): string[] | null {
            return this.#allowedValues ?? null;
        }

        /**
         * Returns the maximum length constraint for this attribute.
         * <p>
         * Only applies to attributes of type {@link AttributeType.OctetString}
         * or {@link AttributeType.ByteString}.
         *
         * @returns the {@link OctetStringLength}, or `null` if not applicable
         */
        get octetStringLength(): OctetStringLength | null {
            return this.#octetStringLength ?? null;
        }

        /**
         * Returns the default value of this attribute.
         *
         * @returns the default value, or `null` if none is defined
         */
        get defaultValue(): string | null {
            return this.#defaultValue ?? null;
        }

        /**
         * Returns whether this attribute can be used in {@link InstanceFilter} expressions.
         *
         * @returns `true` if filtering is supported; `false` otherwise
         */
        get filtering(): boolean {
            return this.#filtering ?? false;
        }

        /**
         * Returns the context in which this attribute is used.
         * <p>
         * Some attributes are only relevant in specific creation or modification contexts.
         *
         * @returns the usage context string, or `null` if undefined
         */
        get usedWhen(): string | null {
            return this.#usedWhen ?? null;
        }

        /**
         * @internal
         */
        static fromJson(json: AttributeModelJson): Attribute {
            return new Attribute(
                json.name,
                json.mandatory,
                AttributeType[json.typeValue as keyof typeof AttributeType],
                json.multiValue,
                json.allowedValues,
                json.lengthValue ? OctetStringLength.parseLengthValue(json.lengthValue) : undefined,
                json.defaultValue,
                json.filtering,
                json.usedWhen
            );
        }
    }
}

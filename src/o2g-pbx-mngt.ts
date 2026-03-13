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

import PbxManagementRest from './internal/rest/pbx-mngt-rest';
import { Model } from './types/pbxmngt/model';
import { PbxAttribute } from './types/pbxmngt/pbx-attribute';
import { PbxObject } from './types/pbxmngt/pbx-object';
import { InstanceFilter } from './types/pbxmngt/instance-filter';
import EventEmitter from 'events';
import { EventRegistry } from './internal/events/event-dispatcher';
import {
    OnPbxObjectInstanceCreated,
    OnPbxObjectInstanceDeleted,
    OnPbxObjectInstanceModified,
} from './types/pbxmngt/pbxmngt-events';
import { Pbx } from './types/pbxmngt/pbx';

/**
 * PbxManagement service allows an administrator to manage an OmniPCX
 * Enterprise, that is to create, modify or delete any object or sub-object in the
 * OmniPCX Enterprise object model. Using this service requires having a
 * <b>MANAGEMENT</b> license.
 * <p>
 * <b>WARNING:</b> Using this service requires a good knowledge of the
 * OmniPCX Enterprise object model.
 * <p>
 * The service uses two kinds of resource: the object model resource and the
 * object instance resource.
 * <p><b><u>The object model</u></b>: The object model can be retrieved for the whole PBX
 * or for a particular object. It provides the detail of object attributes:
 * whether the attribute is mandatory or optional in the object creation, what
 * range of values is authorized, and what the possible enumeration values are.
 * <p><b><u>The object instance</u></b>: It is used to create, modify, retrieve or remove
 * any instances of any object, given the reference of this object. For the
 * creation or modification of an object, the body must be compliant with
 * the object model.
 * <p>
 * The list of sub-objects returned by a get instance of an object corresponds
 * to the relative path of the first instantiable objects in the hierarchy,
 * in order to be able by recursion to build the path to access any object
 * and sub-object.
 * <p>
 * When accessing an object which is a sub-object, the full path must be given:
 * `{object1Name}/{object1Id}/{object2Name}/{object2Id}/.../{objectxName}/{objectxId}`.
 *
 * @example
 * ```typescript
 * // Inspect the object model for the Subscriber object
 * const model = await O2G.pbxManagement.getObjectModel(1, "Subscriber");
 *
 * // Query all analog subscriber instances on node 1
 * const ids = await O2G.pbxManagement.getObjectInstances(1, "Subscriber", "StationType==ANALOG");
 *
 * if (ids && ids.length > 0) {
 *     // Retrieve a specific subscriber with selected attributes
 *     const obj = await O2G.pbxManagement.getObject(
 *         1, "Subscriber", ids[0],
 *         [new PbxAttribute("StationType"), new PbxAttribute("Directory")]
 *     );
 *
 *     // Modify an attribute
 *     await O2G.pbxManagement.setObject(
 *         1, "Subscriber", ids[0],
 *         [new PbxAttribute("Directory", "60200")]
 *     );
 * }
 *
 * // Create a new subscriber
 * await O2G.pbxManagement.createObject(1, "Subscriber", [
 *     new PbxAttribute("StationType", "ANALOG"),
 *     new PbxAttribute("Directory", "60300")
 * ]);
 *
 * // Delete a subscriber, forcing deletion even if they have voice mails
 * await O2G.pbxManagement.deleteObject(1, "Subscriber", "60300", true);
 *
 * // Listen for object change events
 * O2G.pbxManagement.on(PbxManagement.ON_PBX_OBJECT_INSTANCE_MODIFIED, (event) => {
 *     console.log("Object modified:", event.objectName, event.objectId);
 * });
 * ```
 */
export class PbxManagement extends EventEmitter {
    #pbxMngtRest: PbxManagementRest;

    /**
     * Occurs when a PBX object instance is created.
     * Only Object Subscriber is concerned by this event.
     * @event
     */
    static readonly ON_PBX_OBJECT_INSTANCE_CREATED = 'OnPbxObjectInstanceCreated';

    /**
     * Occurs when a PBX object instance is deleted.
     * Only Object Subscriber is concerned by this event.
     * @event
     */
    static readonly ON_PBX_OBJECT_INSTANCE_DELETED = 'OnPbxObjectInstanceDeleted';

    /**
     * Occurs when a PBX object instance is modified.
     * Only Object Subscriber is concerned by this event.
     * @event
     */
    static readonly ON_PBX_OBJECT_INSTANCE_MODIFIED = 'OnPbxObjectInstanceModified';

    /**
     * @internal
     */
    constructor(pbxMngtRest: PbxManagementRest, eventRegistry: EventRegistry) {
        super();

        this.#pbxMngtRest = pbxMngtRest;

        eventRegistry.register(this, PbxManagement.ON_PBX_OBJECT_INSTANCE_CREATED, OnPbxObjectInstanceCreated);
        eventRegistry.register(this, PbxManagement.ON_PBX_OBJECT_INSTANCE_MODIFIED, OnPbxObjectInstanceModified);
        eventRegistry.register(this, PbxManagement.ON_PBX_OBJECT_INSTANCE_DELETED, OnPbxObjectInstanceDeleted);
    }

    /**
     * Gets the list of OmniPCX Enterprise nodes connected on this O2G server.
     *
     * @returns the list of node ids on success; `null` otherwise.
     */
    async getPbxs(): Promise<number[] | null> {
        return this.#pbxMngtRest.getPbxs();
    }

    /**
     * Gets the OmniPCX Enterprise specified by its node id.
     *
     * @param nodeId the PCX Enterprise node id
     * @returns the {@link Pbx} on success; `null` otherwise.
     */
    async getPbx(nodeId: number): Promise<Pbx | null> {
        return this.#pbxMngtRest.getPbx(nodeId);
    }

    /**
     * Gets the description of the data model for the specified object on the
     * specified OmniPCX Enterprise node.
     * <p>
     * If `objectName` is `null`, the global object model of the OmniPCX Enterprise
     * node is returned.
     *
     * @example
     * ```typescript
     * // Get the global object model for node 1
     * const globalModel = await O2G.pbxManagement.getObjectModel(1);
     *
     * // Get the model for a specific object
     * const subscriberModel = await O2G.pbxManagement.getObjectModel(1, "Subscriber");
     * ```
     *
     * @param nodeId     the OmniPCX Enterprise node id
     * @param objectName the object name, or `null` to retrieve the global model
     * @returns the {@link Model} on success; `null` otherwise.
     */
    async getObjectModel(nodeId: number, objectName: string | null = null): Promise<Model | null> {
        return this.#pbxMngtRest.getObjectModel(nodeId, objectName);
    }

    /**
     * Gets the node (root) object.
     *
     * @param nodeId the OmniPCX Enterprise node id
     * @returns the root {@link PbxObject} on success; `null` otherwise.
     */
    async getNodeObject(nodeId: number): Promise<PbxObject | null> {
        return this.#pbxMngtRest.getNodeObject(nodeId);
    }

    /**
     * Gets the object specified by its instance definition and its instance id.
     *
     * @example
     * ```typescript
     * // Retrieve all attributes of a subscriber
     * const obj = await O2G.pbxManagement.getObject(1, "Subscriber", "60200");
     *
     * // Retrieve only specific attributes using a comma-separated string
     * const partial = await O2G.pbxManagement.getObject(
     *     1, "Subscriber", "60200", "StationType,Directory"
     * );
     *
     * // Retrieve specific attributes using a PbxAttribute array
     * const typed = await O2G.pbxManagement.getObject(
     *     1, "Subscriber", "60200",
     *     [new PbxAttribute("StationType"), new PbxAttribute("Directory")]
     * );
     * ```
     *
     * @param nodeId                   the OmniPCX Enterprise node id
     * @param objectInstanceDefinition the object instance definition
     * @param objectId                 the object instance id
     * @param attributes               optional attributes to retrieve — either a
     *                                 comma-separated attribute name string or an
     *                                 array of {@link PbxAttribute} objects
     * @returns the {@link PbxObject} on success; `null` otherwise.
     */
    async getObject(
        nodeId: number,
        objectInstanceDefinition: string,
        objectId: string,
        attributes: string | PbxAttribute[] | null = null
    ): Promise<PbxObject | null> {
        return this.#pbxMngtRest.getObject(nodeId, objectInstanceDefinition, objectId, attributes);
    }

    /**
     * Queries the list of object instances that match the specified filter.
     * <p>
     * A filter can be built using the {@link InstanceFilter} class, or provided
     * as a string expression.
     *
     * @example
     * ```typescript
     * // Using an InstanceFilter object
     * const filter = InstanceFilter.create(
     *     "StationType",
     *     AttributeFilter.Equals,
     *     "ANALOG"
     * );
     * const ids = await O2G.pbxManagement.getObjectInstances(1, "Subscriber", filter);
     *
     * // Using a string expression
     * const ids2 = await O2G.pbxManagement.getObjectInstances(
     *     1, "Subscriber", "StationType==ANALOG"
     * );
     *
     * // Get all instances with no filter
     * const all = await O2G.pbxManagement.getObjectInstances(1, "Subscriber");
     * ```
     *
     * @param nodeId                   the OmniPCX Enterprise node id
     * @param objectInstanceDefinition the object instance definition
     * @param filter                   an optional filter — either an {@link InstanceFilter}
     *                                 object or a string expression
     * @returns the list of matching object instance ids on success; `null` otherwise.
     */
    async getObjectInstances(
        nodeId: number,
        objectInstanceDefinition: string,
        filter: string | InstanceFilter | null = null
    ): Promise<string[] | null> {
        return this.#pbxMngtRest.getObjectInstances(nodeId, objectInstanceDefinition, filter);
    }

    /**
     * Changes one or several attribute values of the specified object.
     *
     * @param nodeId                   the OmniPCX Enterprise node id
     * @param objectInstanceDefinition the object instance definition
     * @param objectId                 the object instance id
     * @param attributes               the array of attributes to change
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see createObject
     * @see deleteObject
     */
    async setObject(
        nodeId: number,
        objectInstanceDefinition: string,
        objectId: string,
        attributes: PbxAttribute[]
    ): Promise<boolean> {
        return this.#pbxMngtRest.setObject(nodeId, objectInstanceDefinition, objectId, attributes);
    }

    /**
     * Deletes the specified instance of an object.
     * <p>
     * The `forceDelete` option is not available for all objects — check its
     * availability in the {@link Model} corresponding to the object. It can be
     * used, for example, to delete a `Subscriber` that has voice mails in their
     * mailbox.
     *
     * @example
     * ```typescript
     * // Standard delete
     * await O2G.pbxManagement.deleteObject(1, "Subscriber", "60200");
     *
     * // Force delete — use when standard delete is blocked (e.g. subscriber has voice mails)
     * await O2G.pbxManagement.deleteObject(1, "Subscriber", "60200", true);
     * ```
     *
     * @param nodeId                   the OmniPCX Enterprise node id
     * @param objectInstanceDefinition the object instance definition
     * @param objectId                 the object instance id
     * @param forceDelete              if `true`, uses the FORCED_DELETE action
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see createObject
     * @see setObject
     */
    async deleteObject(
        nodeId: number,
        objectInstanceDefinition: string,
        objectId: string,
        forceDelete = false
    ): Promise<boolean> {
        return this.#pbxMngtRest.deleteObject(nodeId, objectInstanceDefinition, objectId, forceDelete);
    }

    /**
     * Creates a new object with the specified collection of attributes.
     *
     * @param nodeId                   the OmniPCX Enterprise node id
     * @param objectInstanceDefinition the object instance definition
     * @param attributes               the array of attributes to set at object creation
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see setObject
     * @see deleteObject
     */
    async createObject(nodeId: number, objectInstanceDefinition: string, attributes: PbxAttribute[]): Promise<boolean> {
        return this.#pbxMngtRest.createObject(nodeId, objectInstanceDefinition, attributes);
    }
}

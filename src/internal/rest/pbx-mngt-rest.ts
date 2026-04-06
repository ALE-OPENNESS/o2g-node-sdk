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

import { RestService } from './rest-service';
import { HttpContent } from '../util/http-content';
import UtilUri from '../util/util-uri';
import { AssertUtil } from '../util/assert';
import { Model } from '../../types/pbxmngt/model';
import { PbxObject } from '../../types/pbxmngt/pbx-object';
import { PbxAttribute } from '../../types/pbxmngt/pbx-attribute';
import { InstanceFilter } from '../../types/pbxmngt/instance-filter';
import {
    ObjectModelJson,
    PbxAttributeJson,
    PbxJson,
    PbxObjectIdsJson,
    PbxObjectJson,
} from '../types/pbxmngt/pbxmngt-types';
import { Pbx } from '../../types/pbxmngt/pbx';
import { IHttpClient } from '../util/IHttpClient';
import { Logger } from '../util/logger';
import { LogLevel } from '../../log-level';

/** @internal */
type PbxsJson = {
    nodeIds: string[];
};

/** @internal */
export default class PbxManagementRest extends RestService {
    #logger = Logger.create('PbxManagementRest');

    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async getPbxs(): Promise<Array<number> | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getPbxs`);
        }

        const _json = this.getResult<PbxsJson>(await this._httpClient.get(this._uri));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getPbxs result={}`, _json);
        }

        if (_json && Array.isArray(_json.nodeIds)) {
            return _json.nodeIds.map((e) => parseInt(e));
        } 
        else {
            return null;
        }
    }

    async getPbx(nodeId: number): Promise<Pbx | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getPbx nodeId=${nodeId}`);
        }

        const uriGet = UtilUri.appendPath(this._uri, AssertUtil.positive(nodeId, 'nodeId').toString());

        const _json = this.getResult<PbxJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getPbx result={}`, _json);
        }

        if (!_json) return null;
        return Pbx.fromJson(_json);
    }

    async getObjectModel(nodeId: number, objectName: string | null): Promise<Model | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getObjectModel nodeId=${nodeId}, objectName=${objectName}`);
        }

        let uriGet = UtilUri.appendPath(this._uri, AssertUtil.positive(nodeId, 'nodeId').toString(), 'model');
        if (objectName) {
            uriGet = UtilUri.appendPath(uriGet, objectName);
        }

        const _json = this.getResult<ObjectModelJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getObjectModel result={}`, _json);
        }

        if (!_json) return null;
        return Model.fromJson(_json);
    }

    async getNodeObject(nodeId: number): Promise<PbxObject | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getNodeObject nodeId=${nodeId}`);
        }

        const uriGet = UtilUri.appendPath(this._uri, AssertUtil.positive(nodeId, 'nodeId').toString(), 'instances');

        const _json = this.getResult<PbxObjectJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getNodeObject result={}`, _json);
        }

        if (!_json) return null;
        return PbxObject.fromJson(_json);
    }

    async getObject(
        nodeId: number,
        objectInstanceDefinition: string,
        objectId: string,
        attributes: string | PbxAttribute[] | null
    ): Promise<PbxObject | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getObject nodeId={}, objectInstanceDefinition={}, objectId={}, attributes={}`, 
                nodeId, objectInstanceDefinition, objectId, attributes);
        }

        let uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'instances',
            AssertUtil.notNullOrEmpty(objectInstanceDefinition, 'objectInstanceDefinition'),
            AssertUtil.notNullOrEmpty(objectId, 'objectId')
        );

        if (attributes) {
            if (Array.isArray(attributes)) {
                // Array of PbxAttribute
                uriGet = UtilUri.appendQuery(uriGet, 'attributes', attributes.map((attr) => attr.name).join(','));
            } 
            else {
                uriGet = UtilUri.appendQuery(uriGet, 'attributes', attributes);
            }
        }

        const _json = this.getResult<PbxObjectJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getObject result={}`, _json);
        }

        if (!_json) return null;
        return PbxObject.fromJson(_json);
    }

    async getObjectInstances(
        nodeId: number,
        objectInstanceDefinition: string,
        filter: string | InstanceFilter | null
    ): Promise<string[] | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getObjectInstances nodeId={}, objectInstanceDefinition={}, filter={}`, nodeId, objectInstanceDefinition, filter);
        }

        let uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'instances',
            AssertUtil.notNullOrEmpty(objectInstanceDefinition, 'objectInstanceDefinition')
        );

        if (filter) {
            if (filter instanceof InstanceFilter) {
                // Considered as a Filter object
                uriGet = UtilUri.appendQuery(uriGet, 'filter', filter.value);
            } else {
                uriGet = UtilUri.appendQuery(uriGet, 'filter', filter);
            }
        }

        const _json = this.getResult<PbxObjectIdsJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getObjectInstances result={}`, _json);
        }

        if (!_json) return null;
        return _json.objectIds;
    }

    async setObject(
        nodeId: number,
        objectInstanceDefinition: string,
        objectId: string,
        attributes: PbxAttribute[]
    ): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`setObject nodeId={}, objectInstanceDefinition={}, objectId={}, attributes={}`, nodeId, objectInstanceDefinition, objectId, attributes);
        }

        const uriPut = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'instances',
            AssertUtil.notNullOrEmpty(objectInstanceDefinition, 'objectInstanceDefinition'),
            AssertUtil.notNullOrEmpty(objectId, 'objectId')
        );

        const o2GPbxAttributeList: Array<PbxAttributeJson> = new Array<PbxAttributeJson>();
        attributes.forEach((a) => o2GPbxAttributeList.push(...PbxAttribute.toJson(a)));

        const json = JSON.stringify({
            attributes: o2GPbxAttributeList,
        });
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`setObject request=${json}`);
        }

        const httpResponse = await this._httpClient.put(uriPut, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async createObject(nodeId: number, objectInstanceDefinition: string, attributes: PbxAttribute[]): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`createObject nodeId={}, objectInstanceDefinition={}, attributes={}`), nodeId, objectInstanceDefinition, attributes;
        }

        const uriPost = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'instances',
            AssertUtil.notNullOrEmpty(objectInstanceDefinition, 'objectInstanceDefinition')
        );

        const o2GPbxAttributeList: Array<PbxAttributeJson> = new Array<PbxAttributeJson>();
        attributes.forEach((a) => o2GPbxAttributeList.push(...PbxAttribute.toJson(a)));

        const json = JSON.stringify({
            attributes: o2GPbxAttributeList,
        });
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`createObject request=${json}`);
        }

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async deleteObject(
        nodeId: number,
        objectInstanceDefinition: string,
        objectId: string,
        forceDelete: boolean
    ): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`deleteObject nodeId={}, objectInstanceDefinition={}, objectId={}, forceDelete={}`, nodeId, objectInstanceDefinition, objectId, forceDelete);
        }

        let uriDelete = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'instances',
            AssertUtil.notNullOrEmpty(objectInstanceDefinition, 'objectInstanceDefinition'),
            AssertUtil.notNullOrEmpty(objectId, 'objectId')
        );

        if (forceDelete) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'force');
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }
}

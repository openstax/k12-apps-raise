/* tslint:disable */
/* eslint-disable */
/**
 * RAISE Events API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface IbInputSubmittedV1
 */
export interface IbInputSubmittedV1 {
    /**
     * 
     * @type {number}
     * @memberof IbInputSubmittedV1
     */
    courseId: number;
    /**
     * 
     * @type {string}
     * @memberof IbInputSubmittedV1
     */
    impressionId: string;
    /**
     * 
     * @type {string}
     * @memberof IbInputSubmittedV1
     */
    sourceUri: string;
    /**
     * 
     * @type {number}
     * @memberof IbInputSubmittedV1
     */
    timestamp: number;
    /**
     * 
     * @type {string}
     * @memberof IbInputSubmittedV1
     */
    eventname: IbInputSubmittedV1EventnameEnum;
    /**
     * 
     * @type {string}
     * @memberof IbInputSubmittedV1
     */
    contentId: string;
    /**
     * 
     * @type {string}
     * @memberof IbInputSubmittedV1
     */
    variant: string;
    /**
     * 
     * @type {string}
     * @memberof IbInputSubmittedV1
     */
    response: string;
    /**
     * 
     * @type {string}
     * @memberof IbInputSubmittedV1
     */
    inputContentId: string;
}


/**
 * @export
 */
export const IbInputSubmittedV1EventnameEnum = {
    IbInputSubmittedV1: 'ib_input_submitted_v1'
} as const;
export type IbInputSubmittedV1EventnameEnum = typeof IbInputSubmittedV1EventnameEnum[keyof typeof IbInputSubmittedV1EventnameEnum];


/**
 * Check if a given object implements the IbInputSubmittedV1 interface.
 */
export function instanceOfIbInputSubmittedV1(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "courseId" in value;
    isInstance = isInstance && "impressionId" in value;
    isInstance = isInstance && "sourceUri" in value;
    isInstance = isInstance && "timestamp" in value;
    isInstance = isInstance && "eventname" in value;
    isInstance = isInstance && "contentId" in value;
    isInstance = isInstance && "variant" in value;
    isInstance = isInstance && "response" in value;
    isInstance = isInstance && "inputContentId" in value;

    return isInstance;
}

export function IbInputSubmittedV1FromJSON(json: any): IbInputSubmittedV1 {
    return IbInputSubmittedV1FromJSONTyped(json, false);
}

export function IbInputSubmittedV1FromJSONTyped(json: any, ignoreDiscriminator: boolean): IbInputSubmittedV1 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'courseId': json['course_id'],
        'impressionId': json['impression_id'],
        'sourceUri': json['source_uri'],
        'timestamp': json['timestamp'],
        'eventname': json['eventname'],
        'contentId': json['content_id'],
        'variant': json['variant'],
        'response': json['response'],
        'inputContentId': json['input_content_id'],
    };
}

export function IbInputSubmittedV1ToJSON(value?: IbInputSubmittedV1 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'course_id': value.courseId,
        'impression_id': value.impressionId,
        'source_uri': value.sourceUri,
        'timestamp': value.timestamp,
        'eventname': value.eventname,
        'content_id': value.contentId,
        'variant': value.variant,
        'response': value.response,
        'input_content_id': value.inputContentId,
    };
}


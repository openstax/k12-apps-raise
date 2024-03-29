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
 * @interface ContentLoadFailedV1
 */
export interface ContentLoadFailedV1 {
    /**
     * 
     * @type {number}
     * @memberof ContentLoadFailedV1
     */
    courseId: number;
    /**
     * 
     * @type {string}
     * @memberof ContentLoadFailedV1
     */
    impressionId: string;
    /**
     * 
     * @type {string}
     * @memberof ContentLoadFailedV1
     */
    sourceUri: string;
    /**
     * 
     * @type {number}
     * @memberof ContentLoadFailedV1
     */
    timestamp: number;
    /**
     * 
     * @type {string}
     * @memberof ContentLoadFailedV1
     */
    eventname: ContentLoadFailedV1EventnameEnum;
    /**
     * 
     * @type {string}
     * @memberof ContentLoadFailedV1
     */
    contentId: string;
    /**
     * 
     * @type {string}
     * @memberof ContentLoadFailedV1
     */
    error?: string;
}


/**
 * @export
 */
export const ContentLoadFailedV1EventnameEnum = {
    ContentLoadFailedV1: 'content_load_failed_v1'
} as const;
export type ContentLoadFailedV1EventnameEnum = typeof ContentLoadFailedV1EventnameEnum[keyof typeof ContentLoadFailedV1EventnameEnum];


/**
 * Check if a given object implements the ContentLoadFailedV1 interface.
 */
export function instanceOfContentLoadFailedV1(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "courseId" in value;
    isInstance = isInstance && "impressionId" in value;
    isInstance = isInstance && "sourceUri" in value;
    isInstance = isInstance && "timestamp" in value;
    isInstance = isInstance && "eventname" in value;
    isInstance = isInstance && "contentId" in value;

    return isInstance;
}

export function ContentLoadFailedV1FromJSON(json: any): ContentLoadFailedV1 {
    return ContentLoadFailedV1FromJSONTyped(json, false);
}

export function ContentLoadFailedV1FromJSONTyped(json: any, ignoreDiscriminator: boolean): ContentLoadFailedV1 {
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
        'error': !exists(json, 'error') ? undefined : json['error'],
    };
}

export function ContentLoadFailedV1ToJSON(value?: ContentLoadFailedV1 | null): any {
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
        'error': value.error,
    };
}


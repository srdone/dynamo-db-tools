import { DynamoDB } from 'aws-sdk';
export declare const ATTRIBUTE_TYPES: {
    STRING: string;
    NUMBER: string;
    BINARY: string;
    STRING_SET: string;
    NUMBER_SET: string;
    BINARY_SET: string;
    MAP: string;
    LIST: string;
    NULL: string;
    BOOLEAN: string;
};
export declare function getDynamoDBInstance(): DynamoDB;
export declare function toPromise<T, R, V>(func: (param: T, cb: (err: any, data: V) => void) => R, param: T): Promise<{}>;
export declare function createSchemaMapper(schema: any): (obj: any) => {};

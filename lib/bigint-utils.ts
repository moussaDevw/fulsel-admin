/**
 * Utility functions for handling BigInt serialization in JSON
 * Prisma returns BigInt for some database fields, which cannot be serialized directly
 */

/**
 * Recursively converts BigInt values to strings for JSON serialization
 * @param obj - The object to serialize
 * @returns The serialized object with BigInt values converted to strings
 */
export function serializeBigInt(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    // Handle BigInt
    if (typeof obj === 'bigint') {
        return obj.toString();
    }

    // Handle Arrays
    if (Array.isArray(obj)) {
        return obj.map(serializeBigInt);
    }

    // Handle Objects
    if (typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
        );
    }

    return obj;
}

/**
 * Safely stringify an object that may contain BigInt values
 * @param obj - The object to stringify
 * @param space - Optional spacing for pretty printing
 * @returns JSON string with BigInt values converted to strings
 */
export function stringifyWithBigInt(obj: any, space?: number): string {
    return JSON.stringify(serializeBigInt(obj), null, space);
}

/**
 * Custom JSON replacer function for JSON.stringify that handles BigInt
 * Usage: JSON.stringify(data, bigIntReplacer)
 */
export function bigIntReplacer(key: string, value: any): any {
    return typeof value === 'bigint' ? value.toString() : value;
}

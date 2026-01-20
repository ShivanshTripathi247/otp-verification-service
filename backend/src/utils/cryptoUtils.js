/**
 * This file will have all the crypto related functions
 */
import { timingSafeEqual } from "crypto";

export function checkOtp(inputOtp, code) {
    const bufA = Buffer.alloc(8);
    const bufB = Buffer.alloc(8);
    bufA.writeBigInt64BE(BigInt(inputOtp));
    bufB.writeBigInt64BE(BigInt(code));

    console.log("||||| asdassafafsaf ||||: ", timingSafeEqual(bufA, bufB));
    
    return timingSafeEqual(bufA, bufB);
}
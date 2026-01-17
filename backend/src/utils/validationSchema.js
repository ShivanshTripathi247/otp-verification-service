/** 
 * This file contains the Zod validation logic to 
 * check the validation of email ID provided by the user
 * 
 */

import z from "zod";

class validator {
    constructor() {
        this.emailSchema = z.email("Invalid email address!");
        this.otpSchema = z.number().gte(100000).lte(999999);
    }

    checkEmail(email) {
        this.emailSchema.parse(email);
    }

    checkOtp(code) {
        this.otpSchema.parse(code);
    }
}

export const validatorObj = new validator();
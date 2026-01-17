/** 
 * This file contains the validation middleware
 * for our endpoints
*/

import { validatorObj } from "../../utils/validationSchema.js";
import dns from "dns";


export async function emailValidator(req, res, next) {
    const email = req.body.email;
    
    try {
        validatorObj.checkEmail(email);
        const parts = email.split("@");
        const domain = parts[1];
        
        await dns.resolveMx(domain, (err, result) =>{

            if(err || Object.keys(result).length == 0) {
                console.log("Domain is Wrong!");
                res.status(400).send({success: false, message: "Invalid Email Domain!"});
            }
            else {
                next();
            }
        })
        
    } catch (err) {
        console.log("Error Invalid Email!", err);
        res.status(400).send({success: false, message: "Invalid Email Address!"})
        throw new Error(err);
    }

}

export function otpValidator(req, res, next) {
    const code = req.body.code;

    try {
        validatorObj.checkOtp(code);
        next();
    } catch (err) {
        console.log("Error Invalid OTP Format!", err);
        res.status(400).send({success: false, message: "Invalid OTP Format!"})
    }
}

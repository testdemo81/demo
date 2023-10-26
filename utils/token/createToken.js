import jwt from "jsonwebtoken";

export const createToken = (payload = {}) => {
    (!Object.keys(payload).length) && false;
    return jwt.sign(payload, "generateToken",
        {expiresIn: "24h"} );
};

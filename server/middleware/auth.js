import jwt from 'jsonwebtoken';
import ENV from '../config.js'

/** auth middleware */
export default async function Auth(req, res, next){
    try {

        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];

        // // retrive the user details from the logged in user
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

        //send user in the req property to conatin the userId, and usernme
        req.user = decodedToken;
        // res.json(decodedToken);

        //pass everything over to next function through req.user.
        next()

    } catch (error) {
        res.status(401).json({ error : "Authentication Failed!"})
    }
}


export function localVariables(req, res, next){
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next()
}

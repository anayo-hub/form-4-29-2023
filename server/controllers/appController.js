import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
// import otpGenerator from 'otp-generator';

/** middleware for verify user */

/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {

        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}


/** POST: http://localhost:8080/api/register
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
    try {
      const { username, password, profile, email } = req.body;

      // check the existing user
      const existUsername = await UserModel.findOne({ username });
      //if there is a similar user
      if (existUsername) {
        return res.status(400).send({ error: "Please use unique username" });
      }

      // check for existing email
      const existEmail = await UserModel.findOne({ email });
      if (existEmail) {
        return res.status(400).send({ error: "Please use unique Email" });
      }

      // hash the password
      if (password) {
        //encript the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // then create a mongodb user model
        const user = new UserModel({
          username,
          password: hashedPassword,
          profile: profile || '',
          email
        });
        // save the user details
        const result = await user.save();
        // show that a user was created
        console.log(result);

        return res.status(201).send({ msg: "User Register Successfully" });
      }
    } catch (error) {
      return res.status(500).send({ error: "Internal Server Error" });
    }
}




/** POST: http://localhost:8080/api/login
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await UserModel.findOne({ username });

      if (!user) {
        return res.status(404).send({ error: "Username not found" });
      }

      const passwordCheck = await bcrypt.compare(password, user.password);

      if (!passwordCheck) {
        return res.status(400).send({ error: "Password does not match" });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
        },
        ENV.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).send({
        msg: "Login Successful..at anyo.!",
        username: user.username,
        token,
      });
    } catch (error) {
      return res.status(500).send({ error });
    }
  }

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
    const { username } = req.params;
  
    try {
      if (!username) {
        return res.status(400).send({ error: "Invalid Username" });
      }

      const user = await UserModel.findOne({ username }).select("-password");

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      return res.status(200).send(user);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Server error" });
    }
  }



/** PUT: http://localhost:8080/api/updateuser
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(401).send({ error: "User Not Found" });
    }

    const userData = req.body;

    await UserModel.updateOne({ _id: id }, userData);

    return res.status(200).send({ message: "User data updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Server error" });
  }
}





/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    res.json("hello")
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    res.json("hello")
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
    res.json("hello")
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req,res){
    res.json("hello")
}



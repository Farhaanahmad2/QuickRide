import twilio from "twilio";
import dotenv from "dotenv";
import { User } from "../models/user.model.js"
dotenv.config();
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

class UserController {


  static userLogin = async (req, res) => {
    try {
      const { phonenumber } = req.body;

      if (!phonenumber) {
        return res.status(400).json({ message: 'Phone number is required' });
      }

      const TokenOTP = Math.floor(100000 + Math.random() * 900000).toString()
       
      const user = new User({
        TokenOTP,
        TokenOTPExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      })

      await user.save();


      const client = twilio(accountSid, authToken);
      const message = await client.messages.create({
        to: phonenumber, 
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Your OTP code is ${TokenOTP}`, 
      });


  

    res.status(200).json({ message: 'OTP sent successfully', sid: message.sid });


    } catch (error) {
      console.error('Error sending OTP:', error.message);
      res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }

  };
  
   
  static verifyOTP = async (req, res) => {
    const { code } = req.body;
   
    try {
        const user = await User.findOne({
            TokenOTP : code,
            TokenOTPExpiresAt: { $gt: Date.now() }
        })
        
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        // user.isverified = true;

        user.TokenOTP = undefined;
        user.TokenOTPExpiresAt = undefined;
        await user.save();

        // await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "OTP verified Succefully",
            user: {
				...user._doc,
				password: undefined,
			},
        })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
  }

  
}




export default UserController;




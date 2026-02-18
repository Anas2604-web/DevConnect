const Razorpay = require("razorpay");

const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");

paymentRouter.post("/payment/create", userAuth, async (req,res) => {
     try {
        
     }
     catch(err) {

     }
})
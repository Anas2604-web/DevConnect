const adminAuth = (req,res,next) => {
   const token = "op";
   const isAuthorized = token ==="op";

   if(!isAuthorized) {
      res.status(401).send("Unauthorized");
   }
   else {
      next();
   }
}

const userAuth = (req,res,next) => {
   const token = "op";
   const isAuthorized = token ==="op";

   if(!isAuthorized) {
      res.status(401).send("Unauthorized User");
   }
   else {
      next();
   }
}

module.exports = {adminAuth, userAuth};
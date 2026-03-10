

const isAdminUser = (req,res,next) => {

   console.log("Reached Admin Middleware")
    if(req.userInfo.role !== 'admin'){
        return res.status(403).json({
            success : false,
            message : "Access denied! Admin rightts required"
        })
    }

    next();
}

export default isAdminUser;
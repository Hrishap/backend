const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};


export { asyncHandler};


//can be used like this too
// const asyncHandler = (requestHandler) = aync (req,res,next) => {
//     try{
//         await requestHandler(req,res,next);
//     }catch(error){
//         res.status(err.code || 500).json({
//             success:false,
//             message : error.message || "Internal Server Error",
//         })
//     }
// } 
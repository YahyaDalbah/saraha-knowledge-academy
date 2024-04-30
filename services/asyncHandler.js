export function asyncHandler(fn){

    return (req,res) => {
        fn(req,res).catch(err => {
            return res.json({err: err.stack})
        })
    }
}
const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");


const router = express.Router();

const signupBody  = z.object({
    username: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
})


router.post("/signup",async (req,res)=>{
    const { success } = signupBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            msg:"Invalid Inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            msg:"Email already taken, try another one"
        })
    }else{
        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,

        })

        const userId = user._id;

        const userAccount = await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        })

        const token = jwt.sign({
            userId
        },JWT_SECRET);

        res.json({
            msg:"User created successfully",
            token: token
        })
    }

})


const signinBody = z.object({
    username: z.string().email(),
	password: z.string()
})

router.post("/signin", async (req,res)=>{
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(existingUser){
        const token = jwt.sign({
            userId: existingUser._id
        },JWT_SECRET);

        return res.status(200).json({
            token: token
        })
    }else{
        return res.status(411).json({
            msg:"Error while logging in"
        })
    }
})

const updateUser = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
})

router.put("/",authMiddleware, async (req,res)=>{
    const { success } = updateUser.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg:"Error while updating information"
        })
    }
    await User.updateOne({
        _id: req.userId
    },req.body)

    return res.status(200).json({
        msg:"Updated successfully"
    })
})

router.get("/bulk",authMiddleware, async (req,res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;
const router = require("express").Router();
const bcrypt = require("bcrypt");
const Admins = require("../modals/Admin");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const verify = require("../verify");

env.config();

// register new Admin
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  const newAdmin = new Admins({
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
  });
  try {
    await newAdmin.save();
    res.status(200).json(newAdmin);
  } catch (err) {
    res.status(500).json(err);
  }
});

const generateAccessToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      emai: admin.email,
    },
    process.env.jwt_secret,
    { expiresIn: "1h" }
  );
};

// admin login
router.post("/login", async (req, res) => {
  try {
    const admin = await Admins.findOne({
      email: req.body.email,
    });

    if (admin) {
      const validated = await bcrypt.compare(req.body.password, admin.password);
      if (validated) {
        // generate access token
        const token = generateAccessToken(admin);

        return res.status(200).json({ admin, token });
      } else {
        return res.status(404).json("Admin not found");
      }
    } else {
      return res.status(404).json("Admin not found");
    }
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

// getting all admins
router.get("/", async (req, res) => {
  await Admins.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// delete admin
router.delete("/:id", verify, async (req, res) => {
  const id = req.params.id;
  if (req.admin) {
    try {
      const admin = await Admins.findById(id);
      await Admins.findByIdAndDelete(id);
      res.status(200).json(`${admin.name} deleted`);
    } catch (err) {
      res.status(404).json("Admin not found");
    }
  } else {
    res.status(401).json("not authenticated to delete");
  }
});

module.exports = router;

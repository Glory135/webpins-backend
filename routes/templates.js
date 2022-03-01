const router = require("express").Router();
const Templates = require("../modals/Template");
const verify = require("../verify");
var qs = require("qs");

// download property start
router.post("/download", (req, res) => {
  const fileName = req.body.fileName;
  if (fileName) {
    try {
      res.status(200).download("./uploads/" + fileName);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(404).json("File not Found");
  }
});
// download property end

// create template
router.post("/create", verify, async (req, res) => {
  const newTemp = new Templates(req.body);
  await newTemp
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// getting all templates
router.get("/", async (req, res) => {
  const searchInput = req.query.search;
  const catName = req.query.cat;
  try {
    let temps;
    if (catName) {
      temps = await Templates.find({
        category: {
          $in: [catName],
        },
      });
    } else if (searchInput) {
      temps = await Templates.find({
        name: {
          $in: [searchInput],
        },
      });
    } else {
      temps = await Templates.find();
    }
    res.status(200).json(temps);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update template
router.put("/:id", verify, async (req, res) => {
  const id = req.params.id;
  await Templates.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// delete template
router.delete("/:id", verify, async (req, res) => {
  const id = req.params.id;
  try {
    const template = await Templates.findById(id);
    await Templates.findByIdAndDelete(id);
    res.status(200).json(`deleted ${template.name}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get single template
// router.get("/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     const template = await Templates.findById(id);
//     res.json(template);
//   } catch (err) {
//     res.json("err");
//   }
// });

module.exports = router;

const router = require("express").Router();
const Categories = require("../modals/Category");
const verify = require("../verify");

// create new category
router.post("/", verify, async (req, res) => {
  const newCat = new Categories(req.body);
  await newCat
    .save()
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).json(`${err} failed to create category`);
    });
});

// get all categories
router.get("/", async (req, res) => {
  await Categories.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(`${err} failed to create category`);
    });
});

// update category
router.put("/:id", verify, async (req, res) => {
  const id = req.params.id;
  await Categories.findByIdAndUpdate(
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

// delete cat
router.delete("/:id", verify, async (req, res) => {
  const id = req.params.id;
  try {
    const cat = await Categories.findById(id);
    await Categories.findByIdAndDelete(id);
    res.status(200).json(`deleted ${cat.name}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

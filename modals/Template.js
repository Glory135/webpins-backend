const mongoose = require("mongoose");
const Schema = mongoose.Schema;

TemplateSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    template_file: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Templates = mongoose.model("Templates", TemplateSchema);
module.exports = Templates;

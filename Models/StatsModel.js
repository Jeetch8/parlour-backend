const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  date: {
    type: String,
    default: new Date("<YYYY-mm-dd>"),
  },
  toatalViews: {
    type: Number,
    default: 0,
  },
  blogViews: [
    {
      blogId: { type: mongoose.Schema.Types.ObjectId, ref: "blog" },
      views: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = mongoose.model("stat", statsSchema);

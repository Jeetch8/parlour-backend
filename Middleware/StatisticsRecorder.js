const Stats = require("../Models/StatsModel");

exports.statsRecorder = async (req, res) => {
  const doc = await Stats.findOne({ date: new Date() });
  if (!doc) {
    const createTodayStats = await Stats.create({
      toatalViews: 1,
    });
  }
  console.log(doc);
  //   next();
};

const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  let data = {};
  if (date) {
    data = await service.listOnDate(date);
    console.log(data)
    return res.json({ data });
  }
  console.log(data)
  data = await service.list();
  return res.json({ data });
}

module.exports = {
  list,
};

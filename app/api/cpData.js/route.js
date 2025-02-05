import connectToServiceEaseDB from "../../lib/serviceDB";
import CPData from "../../models/CPData";

export default async function handler(req, res) {
  const { startRow = 0, chunkSize = 400 } = req.query;

  try {
    await connectToServiceEaseDB();

    const totalRows = await CPData.countDocuments({ callIds: { $ne: [] } });
    const data = await CPData.find({ callIds: { $ne: [] } })
      .skip(parseInt(startRow))
      .limit(parseInt(chunkSize));

    res.status(200).json({ data, totalRows });
  } catch (error) {
    console.error("Error fetching CPData:", error);
    res.status(500).json({ error: "Error fetching CPData" });
  }
}

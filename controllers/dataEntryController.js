import DataModel from '../models/studentdataentry.js';


class DataController {
  static createEntry = async (req, res) => {
    try {
      const { dateOfRecord, wakeUpTime, wakingUp, firstGoOut, firstScreenOn, breakfast, schooling, classActivity, outdoorActivity, 
        therapyAtSchool, therapyType, lunch, eveningSnacks, dinner, goingToSleep, goToBedAt, sleepAt, gettingSleepTime, outgoingTendency,
        outgoingCount, screenTime, junkFood, makingNoise, walking, showingAnger, glassCrashTendency, pushingTendency, itemThrowTendency,
        foodWaterThrowTendency, hitWithHand, hitWithHead, cooperateAtSchool, cooperateAtHome, cuttingNails, hairDressing, bedwetting,
         regularMedication, otherSickness, nameOfSickness, medOtherSickness, listOfMedicine, masturbation, toilet, overnightSleeping,
          specialActivity } = req.body;
      
      if (!dateOfRecord) {
        return res.status(400).send({ "status": "failed", "message": "dateOfRecord is required." });
      }

      const dataEntry = new DataModel({
        userId: req.user._id,  
        dateOfRecord,
        wakeUpTime,
        wakingUp,
        firstGoOut,
        firstScreenOn,
        breakfast,
        schooling,
        classActivity,
        outdoorActivity,
        therapyAtSchool,
        therapyType,
        lunch,
        eveningSnacks,
        dinner,
        goingToSleep,
        goToBedAt,
        sleepAt,
        gettingSleepTime,
        outgoingTendency,
        outgoingCount,
        screenTime,
        junkFood,
        makingNoise,
        walking,
        showingAnger,
        glassCrashTendency,
        pushingTendency,
        itemThrowTendency,
        foodWaterThrowTendency,
        hitWithHand,
        hitWithHead,
        cooperateAtSchool,
        cooperateAtHome,
        cuttingNails,
        hairDressing,
        bedwetting,
        regularMedication,
        otherSickness,
        nameOfSickness,
        medOtherSickness,
        listOfMedicine,
        masturbation,
        toilet,
        overnightSleeping,
        specialActivity
      
      });

      await dataEntry.save();
      res.status(201).send({ "status": "success", "message": "Data Entry Created Successfully" });

    } catch (error) {
      console.log(error);
      res.status(500).send({ "status": "failed", "message": "Unable to create data entry." });
    }
  };

  // Endpoint to get user-specific data
  static getUserEntries = async (req, res) => {
    try {
     const dataEntries = await DataModel.find({ userId: req.user._id }); 
     res.status(200).send(dataEntries);
    } catch (error) {
      console.log(error);
    res.status(500).send({ "status": "failed", "message": "Unable to retrieve data entries." });
    }
   
  };
// Fetch specific numeric fields for a user by userId and calculate mean and standard deviation
static getSelectedNumericFieldsWithStatsByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching data for user ID:', userId);

    // Find all entries for the user by userId
    const userEntries = await DataModel.find({ userId: userId });

    // If no entries are found, return a 404 error
    if (!userEntries || userEntries.length === 0) {
      return res.status(404).json({ status: "failed", message: "No entries found for this user" });
    }
      // Initialize groupedDataByDate to store data by date
      const groupedDataByDate = {};
    // Fields we are interested in
    const fieldsToCalculate = [
      'wakingUp', 'firstGoOut', 'firstScreenOn', 'breakfast', 'lunch', 'eveningSnacks', 'dinner',
      'goingToSleep', 'cooperateAtHome', 'overnightSleeping', 'gettingSleepTime', 'outgoingTendency',
      'outgoingCount', 'screenTime', 'junkFood', 'makingNoise', 'walking', 'showingAnger',
      'glassCrashTendency', 'pushingTendency', 'itemThrowTendency', 'foodWaterThrowTendency',
      'hitWithHand', 'hitWithHead', 'masturbation'
    ];


   // Populate groupedDataByDate with values for each field
   userEntries.forEach(entry => {
    const date = entry.dateOfRecord.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    if (!groupedDataByDate[date]) groupedDataByDate[date] = {};

    fieldsToCalculate.forEach(field => {
      if (entry[field] !== undefined) {
        if (!groupedDataByDate[date][field]) groupedDataByDate[date][field] = [];
        groupedDataByDate[date][field].push(entry[field]);
      }
    });
  });

  // Calculate mean and standard deviation for each field by date
  const statsByDate = {};
  for (const [date, fields] of Object.entries(groupedDataByDate)) {
    statsByDate[date] = {};
    for (const [field, values] of Object.entries(fields)) {
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const stdDev = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / values.length);
      statsByDate[date][field] = {
        mean: parseFloat(mean.toFixed(2)),
        stdDev: parseFloat(stdDev.toFixed(2))
      };
    }
  }

  // Return the statistics for each field by date
  res.status(200).json({ status: "success", data: statsByDate });
} catch (error) {
  console.error('Error fetching selected numeric fields with stats by date:', error);
  res.status(500).json({ status: "failed", message: "Failed to fetch selected numeric fields with stats by date" });
}
};
}


export default DataController;

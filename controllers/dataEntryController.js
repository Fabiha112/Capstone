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

    // Find all entries for the user by userId and sort by date
    const userEntries = await DataModel.find({ userId: userId }).sort({ dateOfRecord: 1 });

    // If no entries are found, return a 404 error
    if (!userEntries || userEntries.length === 0) {
      return res.status(404).json({ status: "failed", message: "No entries found for this user" });
    }
    const fieldsToCalculate = [
      'wakingUp', 'firstGoOut', 'firstScreenOn', 'breakfast', 'lunch', 'eveningSnacks', 'dinner',
      'goingToSleep', 'cooperateAtHome', 'overnightSleeping', 'gettingSleepTime', 'outgoingTendency',
      'outgoingCount', 'screenTime', 'junkFood', 'makingNoise', 'walking', 'showingAnger',
      'glassCrashTendency', 'pushingTendency', 'itemThrowTendency', 'foodWaterThrowTendency',
      'toilet', 'hitWithHead', 'masturbation'
    ];


   

  // Initialize batch statistics
  const statsByBatch = [];
  const numericFieldsCollection = {};

  // Prepare batches for each field with exactly 30 entries
  userEntries.forEach((entry,index) => {
    fieldsToCalculate.forEach(field => {
      if (entry[field] !== undefined) {
        if (!numericFieldsCollection[field]) numericFieldsCollection[field] = [];
        numericFieldsCollection[field].push(entry[field]);

        // Calculate stats only when we have exactly 30 entries in a field batch
        if (numericFieldsCollection[field].length === 30) {
          const values = numericFieldsCollection[field];
          const mean = values.reduce((a, b) => a + b, 0) / values.length;
          const stdDev = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / values.length);
          const standardizedValues = values.map(x => parseFloat(((x - mean) / stdDev).toFixed(2)));
          // Get date range for the current 30-entry batch
 const batchStartDate = entry.dateOfRecord.toISOString().split('T')[0];
 const batchEndDate = userEntries[index + 29]?.dateOfRecord.toISOString().split('T')[0];  // Using index here


     
          // Add stats for this batch
          statsByBatch.push({
            field: field,
            dateRange: `${batchStartDate} to ${batchEndDate}`,
            stats: {
              mean: parseFloat(mean.toFixed(2)),
              stdDev: parseFloat(stdDev.toFixed(2)),
          
              standardizedValues
            }
          });
        
          // Reset field batch for the next 30 entries
          numericFieldsCollection[field] = [];
        }
      }
    });
  });

  // Return the statistics for each field by batch of 30 entries
  res.status(200).json({ status: "success", data: statsByBatch });
} catch (error) {
  console.error('Error fetching selected numeric fields with stats by batch:', error);
  res.status(500).json({ status: "failed", message: "Failed to fetch selected numeric fields with stats by batch" });
}
};
// Function to calculate Row Mean for 25 fields
static calculateRowMeanAndSD = async (req, res) => {
  try {
    const userId = req.user._id;  // Get user ID from the authenticated user
    console.log('Fetching data for user ID:', userId);

    // Fetch all entries for the user and sort them by date
    const userEntries = await DataModel.find({ userId }).sort({ dateOfRecord: 1 });

    // If no entries are found, return a 404 error
    if (!userEntries || userEntries.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No entries found for this user."
      });
    }

    // Define the 25 fields you want to include in the calculation
    const fieldsToCalculate = [
      'wakingUp', 'firstGoOut', 'firstScreenOn', 'breakfast', 'lunch', 'eveningSnacks', 'dinner',
      'goingToSleep', 'cooperateAtHome', 'overnightSleeping', 'gettingSleepTime', 'outgoingTendency',
      'outgoingCount', 'screenTime', 'junkFood', 'makingNoise', 'walking', 'showingAnger',
      'glassCrashTendency', 'pushingTendency', 'itemThrowTendency', 'foodWaterThrowTendency',
      'toilet', 'hitWithHead', 'masturbation'
    ];

    // Initialize an array to store the results
    const statsByBatch = [];

    // Iterate through each user entry and calculate row mean
    userEntries.forEach((entry, index) => {
      fieldsToCalculate.forEach(field => {
        if (entry[field] !== undefined) {
          // Extract the field values for the selected 25 fields
          const fieldValues = fieldsToCalculate.map(field => entry[field]);

          // Filter out any undefined or null values to avoid errors in calculation
          const validValues = fieldValues.filter(value => value !== undefined && value !== null);

          // If there are valid values, calculate the row mean
          if (validValues.length > 0) {
            const rowMean = validValues.reduce((sum, value) => sum + value, 0) / validValues.length;

            // Calculate the standard deviation (SD) of the row means
            // First, store all row means for each field
            const rowMeans = userEntries.map(entry => {
              const validValuesForEntry = fieldsToCalculate.map(field => entry[field]).filter(value => value !== undefined && value !== null);
              return validValuesForEntry.length > 0 ? validValuesForEntry.reduce((sum, value) => sum + value, 0) / validValuesForEntry.length : 0;
            });

            // Calculate the SD of row means (for this field)
            const meanOfRowMeans = rowMeans.reduce((a, b) => a + b, 0) / rowMeans.length;
            const variance = rowMeans.reduce((acc, value) => acc + Math.pow(value - meanOfRowMeans, 2), 0) / rowMeans.length;
            const stdDev = Math.sqrt(variance);

            // Push the result to statsByBatch with field, date, row mean, and SD of row means
            statsByBatch.push({
              field: field,
              date: entry.dateOfRecord.toISOString().split('T')[0],  // Format the date (e.g., YYYY-MM-DD)
              rowMean: parseFloat(rowMean.toFixed(2)),  // Round row mean to 2 decimal places
              standardDeviation: parseFloat(stdDev.toFixed(2))  // Round SD to 2 decimal places
            });
          }
        }
      });
    });

    
    res.status(200).json({ status: "success", data: statsByBatch });

  } catch (error) {
    console.error('Error fetching row mean for selected fields:', error);
    res.status(500).json({ status: "failed", message: "Failed to fetch row mean for selected fields" });
  }
};
}




export default DataController;
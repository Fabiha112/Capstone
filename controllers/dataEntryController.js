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
  // Fetch only numeric values for a specific user by userId
  static getAllNumbericFieldsByUserId = async(req,res) => {
    try{
      // Get the userId from the authenticated request
      const userId = req.user._id;
    // Find all entries for the user by userId
      const userEntries = await DataModel.findOne({userId:userId});
      // If no entry is found, return a 404 error
      if(!userEntries.length ===0){
        return res.status(404).json({status:"failed",message:"User entry not found"});
      }
            // Array to hold numeric fields from all entries
            const allNumericFields = userEntries.map(entry => {
              const numericFields = {};
        for (const [key,value]of Object.entries (entry._doc)){
          if(typeof value === 'number'){
            numericFields[key]= value;
          }else if (typeof value === 'object' && value !== null){
              // If it's an object, check if it contains numeric fields (for time objects)
              const numericSubFields ={};
              for (const [subKey, subValue] of Object.entries(value)) {
                if (typeof subValue === 'number') {
                  numericSubFields[subKey] = subValue;
          }
        }
        if (Object.keys(numericSubFields).length > 0) {
          numericFields[key] = numericSubFields;
    }
  };
  
}
return numericFields;
});

 // Return only the numeric fields
 res.status(200).json({ status: "success", data: allNumericFields });
} catch (error) {
  console.error('Error fetching numeric fields:', error);
  res.status(500).json({ status: "failed", message: "Failed to fetch numeric fields" });
}
};
}

export default DataController;

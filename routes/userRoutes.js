import express from 'express'
const router = express.Router();
import UserController from '../controllers/userController.js';
import DataController from '../controllers/dataEntryController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

//Poute Level Middleware
router.use('/changepassword', checkUserAuth);
router.use('/loggeduser', checkUserAuth);

// Public Routes
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin);



// Protected Routes
router.post('/changepassword', UserController.changeUserPassword);
router.get('/loggeduser', UserController.loggedUser);
router.post('/createEntry', checkUserAuth, (req, res, next) => {
    console.log("Accessing /createEntry route"); // Debugging purpose
  

    next();
  }, DataController.createEntry);
  
router.get('/getUserEntries',checkUserAuth ,DataController.getUserEntries);
// Route to get schooling counts for the last 30 days
router.get("/getschoolingPieChartData", checkUserAuth, DataController.getschoolingPieChartData);
// Route for food habit bar chart
router.get("/getFoodBarChartData", checkUserAuth, DataController.getFoodBarChartData);
// Route for SleepingLineChartData
router.get("/getSleepingLineChartData", checkUserAuth, DataController.getSleepingLineChartData);
// Route for screenTimeBarChartData
router.get("/getscreenTimeBarChartData", checkUserAuth, DataController.getscreenTimeBarChartData);
// Route for makingNoiseBarChartData
router.get("/getmakingNoiseBarChartData", checkUserAuth, DataController.getmakingNoiseBarChartData);
// Route for walkingLineChartData
router.get("/getwalkingLineChartData", checkUserAuth, DataController.getwalkingLineChartData);
// Route for wakingLineChartData
router.get("/getwakingUpBarChartData", checkUserAuth, DataController.getwakingUpBarChartData);
// Route for goingToSleepBarChartData
router.get("/getgoingToSleepBarChartData", checkUserAuth, DataController.getgoingToSleepBarChartData);
// Route for classActivityLineChartData
router.get("/getclassActivityLineChartData", checkUserAuth, DataController.getclassActivityLineChartData);
// Route for outdoorActivityLineChartData
router.get("/getoutdoorActivityLineChartData", checkUserAuth, DataController.getoutdoorActivityLineChartData);
// Route for junkFoodLineChartData
router.get("/getjunkFoodLineChartData", checkUserAuth, DataController.getjunkFoodLineChartData);
// Route for getShowingAngerAverageCard
router.get("/getShowingAngerAverageCard", checkUserAuth, DataController.getShowingAngerAverageCard);
// Route for hitWithHandAverageCard
router.get("/gethitWithHandAverageCard", checkUserAuth, DataController.gethitWithHandAverageCard);
// Route for outgoingAverageTendencyCard
router.get("/getoutgoingTendencyAverageCard", checkUserAuth, DataController.getoutgoingTendencyAverageCard);
// Route for bedwettingAverageCard
router.get("/getbedwettingAverageCard", checkUserAuth, DataController.getbedwettingAverageCard)
// Route for cooperateAtSchoolAverageCard
router.get("/getcooperateAtSchoolAverageCard", checkUserAuth, DataController.getcooperateAtSchoolAverageCard)
// Route for schoolingYesCountCard
router.get("/getschoolingCountCard", checkUserAuth, DataController.getschoolingCountCard)
// Route for therapyAtSchoolYesCountCard
router.get("/gettherapyAtSchoolCountCard", checkUserAuth, DataController.gettherapyAtSchoolCountCard)

export default router;
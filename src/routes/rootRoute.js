import express from 'express';
import userRoute from './userRoute.js'
import roomRoute from './roomsRoute.js';
import localRoute from './localRoute.js';
import commentRoute from './commentRoute.js';


const rootRoute = express.Router();

rootRoute.use("/user", userRoute);
rootRoute.use("/room",roomRoute);
rootRoute.use("/local",localRoute);
rootRoute.use("/comment",commentRoute);
export default rootRoute;
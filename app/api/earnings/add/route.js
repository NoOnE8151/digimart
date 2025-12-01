import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connectDB";
import Earnings from "@/models/user/earnings";

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('multiple earnings recived to store for different merchants', data);
    await connectDB();

    const today = new Date().toISOString().split("T")[0];

    if (!data.data) { //check if one earing is recived or array of earnings
      //store single earning
      const existingDoc = await Earnings.findOne({ username: data.merchant }); //check if merchant's document exists

      if (existingDoc) {
        //find today's earnings
        const todayEarning = existingDoc.earnings.find((e) => e.date === today);

        if (todayEarning) {
          // update existing entry
          todayEarning.earnings += data.earnings;
        } else {
          //add new entry for today
          existingDoc.earnings.push({
            date: today,
            earnings: data.earnings,
          });
        }

        await existingDoc.save();
      } else {
        // create new merchant document
        await Earnings.create({
          username: data.merchant,
          earnings: [
            {
              date: today,
              earnings: data.earnings,
            },
          ],
        });
      }
    } else { //handle if multiple earnings objects are recived for different merchants 
      for (const obj of data.data) {
        const existingDoc = await Earnings.findOne({ username: obj.merchant }); //check if merchant's document exists

        if (existingDoc) {
        //find today's earnings
        const todayEarning = existingDoc.earnings.find((e) => e.date === today);

        if (todayEarning) {
          // update existing entry
          todayEarning.earnings += obj.earnings;
        } else {
          //add new entry for today
          existingDoc.earnings.push({
            date: today,
            earnings: obj.earnings,
          });
        }

        await existingDoc.save();
      } else {
        await Earnings.create({
          username: obj.merchant,
          earnings: [{
            date: obj.date,
            earnings: obj.earnings
          }]
        })
      }
      }
    }

    return NextResponse.json({
      success: true,
      message: "successfully stored user's earnings",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: "internal server error",
    });
  }
}

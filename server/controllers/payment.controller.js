import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/payment.model.js";
import { Appointment } from "../models/appointment.model.js";
import { nanoid } from "nanoid";

export const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.price) * 100,
      currency: "INR",
      receipt: `RECEIPT_ID_${nanoid()}`,
    };

    console.log(options, "Options is there ..");
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("Error during checkout:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const appointment = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      email,
      address,
      date,
      time,
      preferredSlot,
      modeOfConsultation,
      razorpay_order_id,
    } = req.body;

    const newAppointment = new Appointment({
      firstName,
      lastName,
      mobileNumber,
      email,
      address,
      date,
      time,
      preferredSlot,
      modeOfConsultation,
      razorpay_order_id,
    });
    await newAppointment.save();

    res.status(201).json({ message: "Appointment booked successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while booking appointment", error: err });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.VITE_APP_RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      const paymentByUser = await Appointment.findOne({
        razorpay_order_id: razorpay_order_id,
      });
      
      if (paymentByUser) {
        await Payment.create({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          firstName: paymentByUser.firstName,
          lastName: paymentByUser.lastName,
          mobileNumber: paymentByUser.mobileNumber,
          email: paymentByUser.email,
          address: paymentByUser.address,
          date: paymentByUser.date,
          time: paymentByUser.time,
          preferredSlot: paymentByUser.preferredSlot,
          modeOfConsultation: paymentByUser.modeOfConsultation,
          currentDate: paymentByUser.currentDate,
          currentTime: paymentByUser.currentTime,
        });

        return res.redirect(
          `${process.env.VITE_HOST_URL_ENDPOINT_FOR_FRONTEND}/paymentsuccess?reference=${razorpay_payment_id}`
        );
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Appointment data not found" });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Request not authentic" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// export const paymentVerification = async (req, res) => {
//   try {
//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
//       req.body;
//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.VITE_APP_RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     const isAuthentic = expectedSignature === razorpay_signature;
//     if (isAuthentic) {
//       await Payment.create({
//         razorpay_payment_id,
//         razorpay_order_id,
//         razorpay_signature,
//       });

//       return res.redirect(
//         `${process.env.VITE_HOST_URL_ENDPOINT_FOR_FRONTEND}/paymentsuccess?reference=${razorpay_payment_id}`
//       );
//     } else {
//       // If not authentic, send a failure JSON response like below
//       res.status(400).json({
//         success: false,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       error: "Internal Server Error",
//     });
//   }
// };

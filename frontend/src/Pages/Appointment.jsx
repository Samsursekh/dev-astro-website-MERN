import React, { useState } from "react";
import axios from "axios";
import TopNavbar from "../components/TopNavbar";
import BottomNavbar from "../components/BottomNavbar";

const Appointment = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    address: "",
    date: "",
    time: "",
    preferredSlot: "morning",
    modeOfConsultation: "online",
    priceOfAppointment: 3000,
  });

  // Handle input changes and update the corresponding state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkoutHandler = async (e, formData) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    let price = formData.priceOfAppointment;
    console.log(price, "This is the price");

    const {
      data: { key },
    } = await axios.get("http://localhost:5000/api/getkey");

    try {
      const {
        data: { order },
      } = await axios.post(
        "http://localhost:5000/api/checkout",
        { price: price },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const options = {
        key, // Enter the Key ID generated from the Dashboard
        amount: order.price,
        currency: "INR",
        name: "Pablo Import Export",
        description: "Test Transaction",
        image:
          "https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: "http://localhost:5000/api/paymentverification",
        prefill: {
          name: `${formData.firstName + formData.lastName}`,
          email: `${formData.email}`,
          contact: `${formData.mobileNumber}`,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#003CF0",
        },
      };
      var razor = new window.Razorpay(options);
      razor.open();
      // console.log(data, "Data is there or not...");
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  return (
    <>
      <section className="bg-gray-100 min-h-screen">
        <div className="hidden md:block">
          <TopNavbar />
        </div>
        <div className="bg-black/30 h-[70px]">
          <BottomNavbar className="text-black" />
        </div>
        <div className="px-4 md:px-0 py-8 max-w-xl mx-auto">
          <form
            action=""
            onSubmit={(e) => checkoutHandler(e, formData)}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4 border border-blue-300"
          >
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <input
              type="text"
              placeholder="Mobile Number"
              name="mobileNumber"
              required
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <textarea
              type="text"
              placeholder="Address"
              name="address"
              required
              rows={4}
              value={formData.address}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {/* Date & Time selection */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                placeholder="Select Date here"
                name="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <input
                type="time"
                placeholder="Select Time here"
                name="time"
                required
                value={formData.time}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {/* preferredSlot & modeOfConsultation selection */}

            <div className="grid grid-cols-2 gap-4">
              <select
                name="preferredSlot"
                value={formData.preferredSlot}
                onChange={handleInputChange}
                id=""
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
              <select
                name="modeOfConsultation"
                value={formData.modeOfConsultation}
                onChange={handleInputChange}
                id=""
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div className="flex items-center justify-center mt-6">
              <button
                className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Appointment;

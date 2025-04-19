import { Car } from "@/types/carType";
import mongoose from "mongoose";

const carSchema = new mongoose.Schema<Car>(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    transmission: { type: String, required: true },
    fuelType: { type: String, required: true },
    price: { type: Number, required: true },
    minimumAge: { type: Number, required: true },
    minimumExperience: { type: Number, required: true },
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export default mongoose.models.Car || mongoose.model("Car", carSchema);

import connectToDatabase from "@/lib/mongoDb";
import car from "@/model/car";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

export const PUT = async (req: NextRequest, { params }) => {
  const { id } = (await params) as { id: string };

  const {
    brand,
    model,
    year,
    price,
    imageUrl,
    fuelType,
    minimumAge,
    minimumExperience,
    transmission,
  } = await req.json();

  if (
    !brand ||
    !model ||
    !year ||
    !price ||
    !imageUrl ||
    !fuelType ||
    !minimumAge ||
    !minimumExperience ||
    !transmission
  ) {
    return new Response(
      JSON.stringify({ message: "Tüm alanların dolu olması gerekmektedir." }),
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const updatedCar = await car.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        brand,
        model,
        year,
        price,
        imageUrl,
        fuelType,
        minimumAge,
        minimumExperience,
        transmission,
      },
      { new: true }
    );
    console.log("id typeof", typeof id);
    console.log("isValidObjectId", Types.ObjectId.isValid(id));

    if (!updatedCar) {
      return new Response(JSON.stringify({ message: "Araç bulunamadı" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Araç başarıyla güncellendi" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Araç güncellenirken hata oluştu" }),
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest, { params }) => {
  const { id } = (await params) as { id: string };

  try {
    await connectToDatabase();

    const deletedCar = await car.findByIdAndDelete(new Types.ObjectId(id));

    if (!deletedCar) {
      return new Response(JSON.stringify({ message: "Araç bulunamadı" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Araç başarıyla silindi" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Araç silinirken hata oluştu" }),
      { status: 500 }
    );
  }
};

import connectToDatabase from "@/lib/mongoDb";
import car from "@/model/car";

export const GET = async () => {
  await connectToDatabase();
  const data = await car.find({});

  if (!data) {
    return new Response("Araçları getirirken hata oluştu", { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
};
export const POST = async (req: Request) => {
  const {
    brand,
    model,
    year,
    price,
    fuelType,
    imageUrl,
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

    const existingCar = await car.findOne({ brand, model, year });
    if (existingCar) {
      return new Response(JSON.stringify({ message: "Bu araç zaten mevcut" }), {
        status: 409,
      });
    }

    const newCar = new car({
      brand,
      model,
      year,
      price,
      imageUrl,
      fuelType,
      minimumAge,
      minimumExperience,
      transmission,
    });

    await newCar.save();

    return new Response(
      JSON.stringify({
        message: "Araç başarıyla eklendi",
        car: newCar,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Araç ekleme hatası:", error);
    return new Response(
      JSON.stringify({ message: "Araç eklenirken hata oluştu" }),
      { status: 500 }
    );
  }
};

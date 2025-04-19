import connectToDatabase from "@/lib/mongoDb";
import UserModel from "@/model/user";

export const GET = async () => {
  try {
    await connectToDatabase();

    const users = await UserModel.find({});
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response("Kullanıcıları getirirken hata oluştu", {
      status: 500,
    });
  }
};

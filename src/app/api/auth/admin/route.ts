export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === "admin" && password === "admin") {
    return new Response(
      JSON.stringify({ message: "Giriş başarılı", data: "admin-token" }),
      {
        status: 200,
      }
    );
  } else {
    return new Response(
      JSON.stringify({
        message: "Hatalı e-posta veya şifre girdiniz",
      }),
      {
        status: 401,
      }
    );
  }
}

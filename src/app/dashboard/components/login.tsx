"use client";

import { setToSessionStorage } from "@/helpers/sessionHelper";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

export default function Login() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body = JSON.stringify(Object.fromEntries(formData.entries()));

    try {
      const respone = await axios.post(
        "http://localhost:3000/api/auth/admin",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (respone.status === 200) {
        const data = await respone.data;
        setToSessionStorage("admin", data.data);
        window.location.href = "/dashboard";
      } else {
        toast.error("Giriş başarısız. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
        toast.error(
          error.response?.data?.message ||
            "Bir hata oluştu. Lütfen tekrar deneyin."
        );
      } else {
        console.error("Error:", error);
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Kullanıcı adı</Form.Label>
          <Form.Control
            type="username"
            name="username"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Şifre</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

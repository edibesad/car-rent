"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/types/userType";
import { useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

export default function DashboardUsers() {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) throw new Error("Kullanıcıları getirirken hata oluştu");
      const data = await response.json();
      setUserList(data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [name]: value });
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`/api/user/${selectedUser?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedUser),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Güncelleme başarısız");

      toast.success("Kullanıcı güncellendi");
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`/api/user/${selectedUser?._id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Silme başarısız");

      toast.success("Kullanıcı silindi");
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Yükleniyor...</div>;
  }

  return (
    <>
      <Card className="container mx-auto mt-6 p-4 shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>İsim</TableHead>
              <TableHead>Soyisim</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Adres</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.surname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell className="flex justify-around">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEditModal(true);
                    }}
                  >
                    Düzenle
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                  >
                    Sil
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Kullanıcı Düzenleme Modalı */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Kullanıcıyı Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form>
              {["name", "surname", "email", "phone", "address"].map((field) => (
                <Form.Group className="mb-3" controlId={field} key={field}>
                  <Form.Label>{field}</Form.Label>
                  <Form.Control
                    type="text"
                    name={field}
                    value={(selectedUser as any)[field]}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              ))}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Vazgeç
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Güncelle
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Silme Onay Modalı */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Kullanıcıyı Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <p>
              <strong>
                {selectedUser.name} {selectedUser.surname}
              </strong>{" "}
              adlı kullanıcıyı silmek istediğinize emin misiniz?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Evet, Sil
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

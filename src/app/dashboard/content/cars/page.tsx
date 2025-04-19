"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Car } from "@/types/carType";
import { useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

export default function DashboardCars() {
  const [carList, setCarList] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newCar, setNewCar] = useState<Car>(emptyCar());
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);

  function emptyCar(): Car {
    return {
      _id: "",
      brand: "",
      model: "",
      year: 0,
      transmission: "",
      fuelType: "",
      price: 0,
      minimumAge: 0,
      minimumExperience: 0,
      imageUrl: "",
    };
  }

  const fetchCars = async () => {
    try {
      const response = await fetch("/api/car");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Araçlar yüklenemedi");
      setCarList(data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedCar) {
      setSelectedCar({ ...selectedCar, [name]: value });
    }
  };

  const handleCreateSubmit = async () => {
    try {
      const response = await fetch("/api/car", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCar),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Ekleme hatası");

      toast.success("Araç eklendi");
      setShowCreateModal(false);
      setNewCar(emptyCar());
      fetchCars();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`/api/car/${selectedCar?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCar),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Güncelleme hatası");

      toast.success("Araç güncellendi");
      setShowEditModal(false);
      setSelectedCar(null);
      fetchCars();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/car/${carToDelete?._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Silme hatası");

      toast.success("Araç silindi");
      setShowDeleteModal(false);
      setCarToDelete(null);
      fetchCars();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const formFields = [
    { label: "Marka", name: "brand" },
    { label: "Model", name: "model" },
    { label: "Yıl", name: "year" },
    { label: "Vites Türü", name: "transmission" },
    { label: "Yakıt Türü", name: "fuelType" },
    { label: "Fiyat", name: "price" },
    { label: "Minimum Yaş", name: "minimumAge" },
    { label: "Minimum Deneyim", name: "minimumExperience" },
    { label: "Resim URL", name: "imageUrl" },
  ];

  return (
    <>
      <Card className="container mx-auto mt-6 p-4 shadow">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Araç Listesi</h4>
          <Button variant="success" onClick={() => setShowCreateModal(true)}>
            + Yeni Araç Ekle
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10">Yükleniyor...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Marka</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Yıl</TableHead>
                <TableHead>Vites</TableHead>
                <TableHead>Yakıt</TableHead>
                <TableHead>Fiyat</TableHead>
                <TableHead>Min Yaş</TableHead>
                <TableHead>Min Tecrübe</TableHead>
                <TableHead>Resim</TableHead>
                <TableHead>İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carList.map((car) => (
                <TableRow key={car._id}>
                  <TableCell>{car._id}</TableCell>
                  <TableCell>{car.brand}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>{car.transmission}</TableCell>
                  <TableCell>{car.fuelType}</TableCell>
                  <TableCell>{car.price}</TableCell>
                  <TableCell>{car.minimumAge}</TableCell>
                  <TableCell>{car.minimumExperience}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => window.open(car.imageUrl, "_blank")}
                    >
                      Gör
                    </Button>
                  </TableCell>
                  <TableCell className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => {
                        setSelectedCar(car);
                        setShowEditModal(true);
                      }}
                    >
                      Düzenle
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setCarToDelete(car);
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
        )}
      </Card>

      {/* Yeni Araç Ekle Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Yeni Araç Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {formFields.map((f) => (
              <Form.Group className="mb-3" controlId={f.name} key={f.name}>
                <Form.Label>{f.label}</Form.Label>
                <Form.Control
                  type="text"
                  name={f.name}
                  value={(newCar as any)[f.name]}
                  onChange={handleCreateChange}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Kapat
          </Button>
          <Button variant="success" onClick={handleCreateSubmit}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Araç Düzenle Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Araç Güncelle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {formFields.map((f) => (
              <Form.Group
                className="mb-3"
                controlId={`edit-${f.name}`}
                key={f.name}
              >
                <Form.Label>{f.label}</Form.Label>
                <Form.Control
                  type="text"
                  name={f.name}
                  value={(selectedCar as any)?.[f.name] || ""}
                  onChange={handleEditChange}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Vazgeç
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Güncelle
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Silme Onay Modali */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Araç Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {carToDelete && (
            <p>
              <strong>
                {carToDelete.brand} {carToDelete.model}
              </strong>{" "}
              aracını silmek istediğinizden emin misiniz?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Evet, Sil
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

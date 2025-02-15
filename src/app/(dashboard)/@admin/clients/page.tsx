"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import LoadingComponent from "@/components/shared/LoadingComponent";
import Modal from "@/components/shared/Modal";

export default function RequestsTable() {
  const router = useRouter();
  const [pageSize, setPageSize] = useState<number>(() => {
    const savedPageSize = localStorage.getItem("pageSize");
    return savedPageSize ? Number(savedPageSize) : 20;
  });
  const [page, setPage] = useState(1);
  const { data, mutate, isLoading } = useSWR(
    `/api/clients?page=${page}&pageSize=${pageSize}`,
    fetcher
  );

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [initialData, setInitialData] = useState<{ [key: string]: any }>({});
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [addressOptions, setAddressOptions] = useState<string[]>([]);

  const [fields, setFields] = useState([
    {
      name: "client_name",
      type: "autocomplete",
      placeholder: "ФИО клиента",
      apiEndpoint: "/api/clients/autocomplete",
    },
    { name: "description", type: "text", placeholder: "Описание" },
    { name: "request_date", type: "date", placeholder: "Дата заявки" },
    { name: "request_time", type: "time", placeholder: "Время заявки" },
    { name: "due_date", type: "date", placeholder: "Дата выполнения" },
    {
      name: "status_id",
      type: "select",
      options: statusOptions,
      placeholder: "Выберите статус",
    },
    {
      name: "address_id",
      type: "autocomplete",
      options: addressOptions,
      placeholder: "Выберите адрес",
      apiEndpoint: "/api/clients/addresses/autocomplete",
    },
    {
      name: "assigned_to",
      type: "autocomplete",
      placeholder: "ФИО сотрудника",
      apiEndpoint: "/api/employees/autocomplete",
    },
  ]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    localStorage.setItem("pageSize", String(pageSize));
  }, [pageSize]);

  useEffect(() => {
    // Fetch status options and address options
    const fetchOptions = async () => {
      try {
        const [statusRes, addressRes] = await Promise.all([
          fetch("/api/clients/statuses"),
          fetch("/api/clients/addresses"),
        ]);

        const statuses = await statusRes.json();
        const addresses = await addressRes.json();

        setStatusOptions(statuses.map((status: any) => status.name));
        setAddressOptions(addresses.map((address: any) => address.name));
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить заявку?")) {
      await fetch(`/api/clients/${id}`, { method: "DELETE" });
      mutate();
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const openCreateModal = () => {
    setModalTitle("Добавить заявку");
    setInitialData({});
    setModalOpen(true);
  };

  const openEditModal = (request: {
    id: number;
    description: string;
    request_date: string;
  }) => {
    setModalTitle("Редактировать заявку");
    setInitialData(request);
    setModalOpen(true);
  };

  const handleCreateOrUpdate = async (formData: { [key: string]: any }) => {
    const url = formData.id ? `/api/clients/${formData.id}` : `/api/clients`;
    const method = formData.id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании или обновлении заявки");
      }

      const result = await response.json();
      console.log("Request successfully created/updated:", result);

      mutate(); // Refreshes the table data
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Ошибка при добавлении заявки. Проверьте правильность данных.");
    }
  };

  if (loading) {
    return (
      <LoadingComponent place="up">
        <p className="font-medium">
          Подождите, пока мы загружаем информацию о заказах
        </p>
      </LoadingComponent>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-[#bfa156] mb-4">Заявки клиентов</h1>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={openCreateModal}
          className="bg-[#bfa156] text-white px-4 py-2 rounded-xl hover:bg-[#a98e4e] transition"
        >
          Добавить заявку
        </button>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded-xl px-3 py-1 text-gray-600"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} записей на странице
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border border-gray-200 rounded-2xl shadow-sm">
        <thead>
          <tr className="bg-[#bfa156] text-white rounded-2xl">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Описание</th>
            <th className="px-4 py-2">Дата заявки</th>
            <th className="px-4 py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {data?.requests.map((request: any) => (
            <tr key={request.id} className="border hover:bg-gray-50 text-center items-center">
              <td className="px-4 py-2">{request.id}</td>
              <td className="px-4 py-2">{request.description}</td>
              <td className="px-4 py-2">
                {new Date(request.request_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 flex space-x-2 justify-center gap-5">
                <button
                  onClick={() => openEditModal(request)}
                  className="text-[#bfa156] hover:text-[#7d6a37]"
                >
                  <Pencil className="w-5 h-5 inline-block" />
                </button>
                <button
                  onClick={() => handleDelete(request.id)}
                  className="text-red-500 hover:text-[#6b272e]"
                >
                  <Trash className="w-5 h-5 inline-block" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 text-sm text-gray-600 disabled:text-gray-300"
        >
          Назад
        </button>
        <span className="text-gray-600">Страница {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data || page * pageSize >= data.totalRequests}
          className="px-4 py-2 text-sm text-gray-600 disabled:text-gray-300"
        >
          Вперед
        </button>
      </div>

      {/* Универсальное модальное окно для создания и редактирования */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        title={modalTitle}
        initialData={initialData}
        fields={fields}
      />
    </div>
  );
}

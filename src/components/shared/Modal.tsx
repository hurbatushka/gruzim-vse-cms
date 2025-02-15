import React, { useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { [key: string]: any }) => void;
  title: string;
  initialData?: { [key: string]: any };
  fields: {
    name: string;
    type: string;
    placeholder?: string;
    options?: string[]; // Для select
    apiEndpoint?: string; // Для автозаполнения
    isStatusField?: boolean; // Для поля со статусами
    isAddressField?: boolean; // Для поля с автозаполнением адреса
  }[];
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData = {},
  fields,
}) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [statuses, setStatuses] = useState<
    { id: number; status_name: string }[]
  >([]);
  const [addresses, setAddresses] = useState<
    { id: number; address_line: string }[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      loadStatuses();
      loadAddresses();
    }
  }, [isOpen, initialData]);

  // Функция для загрузки статусов
  const loadStatuses = async () => {
    try {
      const response = await fetch("/api/clients/statuses");
      const data = await response.json();
      setStatuses(data);
    } catch (error) {
      console.error("Ошибка при загрузке статусов:", error);
    }
  };

  // Функция для загрузки адресов
  const loadAddresses = async () => {
    try {
      const response = await fetch("/api/clients/addresses");
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error("Ошибка при загрузке адресов:", error);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-8 rounded-xl shadow-xl w-96 max-w-full">
        <h2 className="text-2xl font-semibold text-black text-center mb-6">
          {title}
        </h2>
        {fields.map((field) => (
          <div key={field.name} className="mb-4">
            {/* Проверка на поле даты */}
            {field.type === "date" && (
              <label
                htmlFor={field.name}
                className="block text-gray-700 font-medium mb-2"
              >
                {field.placeholder || "Выберите дату"}
              </label>
            )}
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-xl"
              >
                <option value="" disabled>
                  {field.placeholder || "Выберите"}
                </option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.isStatusField ? (
              <select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-xl"
              >
                <option value="" disabled>
                  {field.placeholder || "Выберите статус"}
                </option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.status_name}
                  </option>
                ))}
              </select>
            ) : field.isAddressField ? (
              <AutocompleteAddressField
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder || ""}
                addresses={addresses}
                setAddresses={setAddresses}
              />
            ) : field.type === "autocomplete" ? (
              <AutocompleteField
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder || ""}
                apiEndpoint={field.apiEndpoint || ""}
              />
            ) : field.type === "date" ? (
              <input
                type="date"
                name={field.name}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder || ""}
                className="w-full p-2 border border-gray-300 rounded-xl"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder || ""}
                className="w-full p-2 border border-gray-300 rounded-xl"
              />
            )}
          </div>
        ))}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-colors duration-200"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#bfa156] text-white rounded-xl hover:bg-[#a98e4e] transition-colors duration-200"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

// AutocompleteField component for dynamic suggestions
const AutocompleteField = ({
  name,
  value,
  onChange,
  placeholder,
  apiEndpoint,
}: {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder: string;
  apiEndpoint: string;
}) => {
  const [suggestions, setSuggestions] = useState<
    { id: number; name: string }[]
  >([]);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue && inputValue.length > 2) {
        const fetchSuggestions = async () => {
          const response = await fetch(`${apiEndpoint}?query=${inputValue}`);
          const data = await response.json();
          const formattedData = data.map(
            (item: { id: number; first_name: string; last_name: string }) => ({
              id: item.id,
              name: `${item.first_name} ${item.last_name}`,
            })
          );
          setSuggestions(formattedData);
        };
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, apiEndpoint]);

  const handleSelect = (item: { id: number; name: string }) => {
    setInputValue(item.name);
    onChange(name, item.id.toString());
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className="px-3 hover:bg-gray-200 cursor-pointer"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AutocompleteAddressField = ({
  name,
  value,
  onChange,
  placeholder,
  addresses,
  setAddresses,
}: {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder: string;
  addresses: { id: number; address_line: string }[];
  setAddresses: React.Dispatch<
    React.SetStateAction<{ id: number; address_line: string }[]>
  >;
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<
    { id: number; address_line: string }[]
  >([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue && inputValue.length > 2) {
        const fetchSuggestions = async () => {
          const response = await fetch(
            `/api/clients/addresses/autocomplete?query=${inputValue}`
          );
          const data = await response.json();
          setSuggestions(data); // Устанавливаем предложения
        };
        fetchSuggestions();
      } else {
        setSuggestions([]); // Если нет текста, очищаем предложения
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSelect = (item: { id: number; address_line: string }) => {
    setInputValue(item.address_line); // Обновляем значение ввода
    onChange(name, item.id.toString()); // Отправляем ID адреса как строку
    setSuggestions([]); // Закрываем список предложений
  };

  const handleAddNewAddress = async () => {
    if (!inputValue) return;

    const newAddress = { address_line: inputValue }; // Строка адреса

    try {
      const response = await fetch("/api/clients/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      const data = await response.json();
      setAddresses((prev) => [...prev, data]); // Обновляем список адресов
      setInputValue(data.address_line); // Обновляем значение поля
      onChange(name, data.id.toString()); // Отправляем ID нового адреса
    } catch (err) {
      console.error("Ошибка при добавлении нового адреса:", err);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded mt-1 mb-5 max-h-48 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)} // Передаем item для выбора
              className="px-3 hover:bg-gray-200 cursor-pointer"
            >
              {item.address_line}
            </li>
          ))}
        </ul>
      )}
      {suggestions.length === 0 && inputValue && (
        <button onClick={handleAddNewAddress} className="mt-2 text-blue-500">
          Добавить новый адрес
        </button>
      )}
    </div>
  );
};

export default Modal;

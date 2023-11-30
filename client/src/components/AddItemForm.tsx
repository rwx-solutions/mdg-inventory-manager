import { ChangeEvent, useState } from "react";
import { ItemService } from "../services/ItemService";
import type { Item } from "../types";

export const AddItemForm = () => {
  const [item, setItem] = useState<Partial<Item>>({
    partNumber: "",
    serialNumber: "",
    purchaseOrder: "",
    description: "",
    category: "",
    price: 0,
    quantity: 0,
  });
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setItem({
      partNumber: "",
      serialNumber: "",
      purchaseOrder: "",
      description: "",
      category: "",
      price: 0,
      quantity: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await ItemService.createItem(item);
      resetForm();
    } catch (error) {
      setError("An error occurred while adding the item.");
      console.error("Error:", error);
    }
  };

  return (
    <section className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Part Number"
            name="partNumber"
            value={item.partNumber ?? ""}
            onChange={handleChange}
            required
          />
          <InputField
            label="Serial Number"
            name="serialNumber"
            value={item.serialNumber ?? ""}
            onChange={handleChange}
          />
          <InputField
            label="Purchase Order"
            name="purchaseOrder"
            value={item.purchaseOrder ?? ""}
            onChange={handleChange}
            required
          />
          <InputField
            label="Description"
            name="description"
            value={item.description ?? ""}
            onChange={handleChange}
          />
          <InputField
            label="Category"
            name="category"
            value={item.category ?? ""}
            onChange={handleChange}
          />
          <InputField
            label="Price"
            name="price"
            type="number"
            value={item.price ?? 0}
            onChange={handleChange}
          />
          <InputField
            label="Quantity"
            name="quantity"
            type="number"
            value={item.quantity ?? 0}
            onChange={handleChange}
          />
          <InputField
            label="Status"
            name="status"
            value={item.status ?? ""}
            onChange={handleChange}
          />
          <InputField
            label="Repair Order Number"
            name="repairOrderNumber"
            value={item.repairOrderNumber ?? ""}
            onChange={handleChange}
          />
          <InputField
            label="Condition"
            name="condition"
            value={item.condition ?? ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Item
          </button>
        </div>
      </form>
    </section>
  );
};

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}: InputFieldProps) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300"
    />
  </div>
);
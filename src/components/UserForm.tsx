import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { createUser, updateUser } from "../api/api";

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UserFormProps {
  user?: User;
  onSave: () => void;
}

const UserForm = ({ user, onSave }: UserFormProps) => {
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        await updateUser(user.id!, formData);
      } else {
        await createUser(formData);
      }
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      onSave();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="flex justify-center items-start w-full flex-grow px-6">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-xl font-bold mb-4">
          {user ? "Update User" : "Create User"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border p-2 rounded"
          />
        </div>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded w-full mt-2"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="border p-2 rounded w-full mt-2"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
        >
          {user ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://user-management-system-oxwf.onrender.com/api/auth/register",
        { name, email, password }
      );

      alert("Registered successfully");
      navigate("/");
    } catch (error) {
      alert("Registration failed", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#222]">
      <form onSubmit={handleRegister} className="bg-white p-6 shadow w-90 rounded-xl">
        <h2 className="text-2xl font-bold mb-5 text-center">Register</h2>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-3 rounded-md"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded-md"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded-md"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-purple-900 text-white w-full p-2.5 rounded-md hover:bg-purple-800 cursor-pointer">
          Register
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-purple-900 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
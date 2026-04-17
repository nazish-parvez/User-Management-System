import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://user-management-system-oxwf.onrender.com/api/auth/login",
        { email, password },
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#222]">
      <form onSubmit={handleLogin} className="bg-white p-8 w-90 rounded-xl">
        <h2 className="text-2xl mb-6 font-bold text-center">Login</h2>

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
          Login
        </button>
        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <span
            className="text-purple-900 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;

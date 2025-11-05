import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErr("");

  const email = (form.email || "").trim().toLowerCase();
  const password = String(form.password || "");

  if (!email || !password) return setErr("Email and password are required");
  try {
    setLoading(true);
  // Clear any stale session before starting
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("perms");


  const { data } = await api.post("/auth/login", { email, password, remember });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("perms", JSON.stringify(data.permissions || []));
    if (remember) localStorage.setItem("remember", "1");
    navigate("/");
  } catch (error) {
    setErr(error?.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-green-200 via-emerald-300 to-teal-500 flex items-center justify-center px-3 py-4 md:py-8">
      <div className="w-full max-w-[360px] sm:max-w-md md:max-w-lg">
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-black/5 p-4 sm:p-6 md:p-8">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/Crispy-Dosalogo.png"
              alt="Crispydosa"
              className="h-14 sm:h-10 md:h-14 object-contain"
              draggable="false"
            />
          </div>

          <div className="mt-2 sm:mt-3 md:mt-4 text-center">
           
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/70 px-3 py-1 mb-2 sm:mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] sm:text-xs font-medium text-emerald-700 tracking-wide">
                Central Kitchen Portal
              </span>
            </div>

            <h2 className="leading-tight font-extrabold tracking-tight">
              <span className="block text-[20px] sm:text-[22px] md:text-[28px] text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 drop-shadow-sm">
                Welcome to
              </span>

              <span className="mt-0.5 block text-[24px] sm:text-[28px] md:text-[34px] text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Crispy Dosa Central Kitchen
              </span>
            </h2>
          </div>

          {/* Error */}
          {err && (
            <div className="mt-3 sm:mt-4 rounded-lg bg-red-50 text-red-700 text-xs sm:text-sm px-3 py-2 border border-red-200">
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
      
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email"
                autoComplete="email"
                inputMode="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="sr-only" htmlFor="password">Password</label>
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-12 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
          
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto h-9 w-9 grid place-items-center rounded-md text-gray-600 hover:bg-gray-100 active:scale-[0.98]"
                aria-label="Toggle password visibility"
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 pt-1">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-md bg-emerald-700 px-5 sm:px-6 md:px-8 py-2.5 text-white text-sm sm:text-base font-medium hover:bg-emerald-800 disabled:opacity-60 active:scale-[0.99] transition"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Logging in…
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
            Forgot password? <span className="text-emerald-700 font-medium">Contact admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}

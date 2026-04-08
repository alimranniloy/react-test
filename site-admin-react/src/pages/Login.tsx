import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { USER_ACTIVE_UPDATE, USER_OTP_UPDATE } from "@/graphql/mutations/me";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";

type LoginStep = "initial" | "login" | "otp";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const site = useSiteStore((state) => state.site);
  const getSiteByDomain = useSiteStore((state) => state.getSiteByDomain);
  const checkUser = useAuthStore((state) => state.checkUser);
  const loginWithPassword = useAuthStore((state) => state.loginWithPassword);
  const loginWithOtp = useAuthStore((state) => state.loginWithOtp);
  const loading = useAuthStore((state) => state.loading);
  const message = useAuthStore((state) => state.message);
  const setMessage = useAuthStore((state) => state.setMessage);
  const [step, setStep] = useState<LoginStep>("initial");
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean | null>(null);

  const [sendOtp, { loading: otpSending }] = useMutation(USER_OTP_UPDATE);
  const [activateUser, { loading: otpVerifying }] =
    useMutation(USER_ACTIVE_UPDATE);

  const subtitle = useMemo(() => {
    if (step === "otp") return "Activate your account";
    if (step === "login") return "Enter your password to continue";
    return "Use your phone number to continue";
  }, [step]);

  const redirect =
    (location.state as { from?: Location })?.from?.pathname ?? "/";

  useEffect(() => {
    const rawDomain =
      typeof window !== "undefined" ? window.location.hostname : "";
    const domain =
      import.meta.env.DEV &&
      (rawDomain === "localhost" || rawDomain === "127.0.0.1")
        ? "bponitest.store.bponi.com"
        : rawDomain;
    if (domain) {
      getSiteByDomain(domain);
    }
  }, [getSiteByDomain]);

  const handleCheckUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    const trimmed = userInput.trim();
    if (!trimmed) return;
    const user = await checkUser(trimmed);
    if (!user?.id) {
      setMessage("Account not found. Please try again.");
      return;
    }
    setUserId(user.id);
    setIsActive(!!user.isActive);
    setStep(user.isActive ? "login" : "otp");
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!userId) return;
    const success = await loginWithPassword(userId, password);
    if (success) {
      navigate(redirect, { replace: true });
    }
  };

  const handleSendOtp = async () => {
    if (!userId || otpSending || timer > 0) return;
    setMessage(null);
    try {
      await sendOtp({
        variables: {
          id: userId,
          source: site?.domain ?? "www.bponi.com",
          sourceId: site?.createdById ?? 1,
        },
      });
      setTimer(60);
      const interval = window.setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            window.clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const handleOtpLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId || !otp) return;
    setMessage(null);
    try {
      await activateUser({ variables: { id: userId, otp: Number(otp) } });
      const success = await loginWithOtp(userId, Number(otp));
      if (success) {
        navigate(redirect, { replace: true });
      }
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const normalizePhoneInput = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.startsWith("88")) return trimmed;
    if (/^01\d{9}$/.test(trimmed)) return `88${trimmed}`;
    return trimmed;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-xl border bg-white">
        <div className="border-b px-6 py-4 text-center text-sm font-semibold text-slate-700">
          {site?.isWhiteLabel ? "Welcome" : "Welcome to Bponi"}
        </div>
        <div className="flex items-center gap-3 px-6 pt-5">
          <div className="h-10 w-10 overflow-hidden rounded-full border bg-slate-100">
            {site?.favicon ? (
              <img
                src={site.favicon as string}
                alt={site.title as string}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              {site?.title ?? "Site Admin"}
            </h2>
            <p className="text-xs text-slate-500">{message ?? subtitle}</p>
          </div>
        </div>

        <div className="px-6 py-6">
          {step === "initial" ? (
            <form onSubmit={handleCheckUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Phone Number
                </label>
                <input
                  value={userInput}
                  onChange={(event) =>
                    setUserInput(normalizePhoneInput(event.target.value))
                  }
                  name="phone-number"
                  autoComplete="tel"
                  placeholder="8801XXXXXXXXX"
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={!userInput.trim() || loading}
                className="w-full rounded-md bg-brand-600 text-white py-2 text-sm font-medium hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? "Checking..." : "Continue"}
              </button>
            </form>
          ) : null}

          {step === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Phone Number
                </label>
                <input
                  value={userInput}
                  readOnly
                  className="w-full rounded-md border px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={!password || loading}
                className="w-full rounded-md bg-brand-600 text-white py-2 text-sm font-medium hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button
                type="button"
                onClick={() => setStep("initial")}
                className="w-full text-xs text-brand-600 hover:underline"
              >
                Change phone number
              </button>
            </form>
          ) : null}

          {step === "otp" ? (
            <form onSubmit={handleOtpLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Phone Number
                </label>
                <input
                  value={userInput}
                  readOnly
                  className="w-full rounded-md border px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  OTP
                </label>
                <input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  type="text"
                  maxLength={6}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpSending || timer > 0}
                className="w-full rounded-md border border-brand-600 text-brand-700 py-2 text-sm font-medium hover:bg-brand-50 disabled:opacity-60"
              >
                {timer > 0 ? `Resend in ${timer}s` : "Send OTP"}
              </button>
              <button
                type="submit"
                disabled={!otp || otpVerifying}
                className="w-full rounded-md bg-brand-600 text-white py-2 text-sm font-medium hover:bg-brand-700 disabled:opacity-60"
              >
                {otpVerifying ? "Verifying..." : "Verify & Login"}
              </button>
              <button
                type="button"
                onClick={() => setStep("initial")}
                className="w-full text-xs text-brand-600 hover:underline"
              >
                Change phone number
              </button>
              {isActive === false ? (
                <p className="text-xs text-slate-500 text-center">
                  Activate your account with the OTP sent to your phone.
                </p>
              ) : null}
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

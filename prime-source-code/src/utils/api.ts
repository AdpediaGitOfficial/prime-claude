const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const { headers: extraHeaders, ...rest } = options;

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(extraHeaders ? (extraHeaders as Record<string, string>) : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg =
      (errorData as any).error ||
      (errorData as any).message ||
      (errorData as any).detail ||
      `Server error ${response.status}`;
    console.error("[API]", response.status, endpoint, errorData);
    throw new Error(msg);
  }

  return response.json();
};

export const ENDPOINTS = {
  SEND_OTP: "/api/auth/send-otp",
  CREATE_BOOKING: "/api/bookings/create-verified",
  HALL_BOOKINGS: "/hall-bookings",
  SPA_BOOKINGS: "/spa-bookings",
  GYM_MEMBERSHIPS: "/gym-memberships",
  VENDOR_INVITES: "/vendor-invites",
  COURSE_REGISTRATIONS: "/course-registrations",
  CONTACT_ENQUIRIES: "/contact-enquiries",
  LISTINGS: "/listings",
  SITE_SETTINGS: "/site-settings",
} as const;

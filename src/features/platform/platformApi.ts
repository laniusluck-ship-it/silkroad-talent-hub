export type PlatformResult<T> = {
  success: boolean;
  data: T | null;
  message: string;
  errors: Array<{ code: string; field?: string; message: string }>;
};

export function unwrapPlatformResult<T>(result: PlatformResult<T>): T {
  if (!result.success || result.data === null) {
    throw new Error(result.message || "平台接口请求失败");
  }

  return result.data;
}

export function getPlatformErrorMessage(result: PlatformResult<unknown>) {
  if (result.message) return result.message;
  return (
    result.errors
      .map((error) => error.message)
      .filter(Boolean)
      .join("；") || "平台接口请求失败"
  );
}

export function getDuplicateSubmitMessage(result: PlatformResult<{ duplicate?: boolean }>) {
  if (result.success && result.data?.duplicate) {
    return result.message || "已收到你的提交，请勿重复提交";
  }

  return null;
}

export const platformApiStatus = {
  overview: "pending-integration",
  search: "pending-integration",
  courseDetail: "pending-integration",
  jobApplication: "pending-integration",
  contestRegistration: "pending-integration",
  certificateVerification: "pending-integration",
} as const;

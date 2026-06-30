import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { ApiError, ServiceResult } from "../server/platform-service.server";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^1[3-9]\d{9}$/, "请输入有效的中国大陆手机号");

const optionalTextSchema = z.string().trim().min(1).max(80).optional();
const idempotencyKeySchema = z.string().trim().min(8).max(100).optional();

const searchSchema = z.object({
  keyword: z.string().trim().max(80).optional(),
  entity: z.enum(["all", "course", "job", "certification", "contest", "news"]).optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

const courseDetailSchema = z.object({ courseId: z.string().trim().min(1).max(80) });
const jobDetailSchema = z.object({ jobId: z.string().trim().min(1).max(80) });
const certificationDetailSchema = z.object({
  certificationId: z.string().trim().min(1).max(80),
});
const contestDetailSchema = z.object({ contestId: z.string().trim().min(1).max(80) });

const courseEnrollmentSchema = z.object({
  courseId: z.string().trim().min(1).max(80),
  learnerName: z.string().trim().min(2).max(40),
  phone: phoneSchema,
  school: optionalTextSchema,
  idempotencyKey: idempotencyKeySchema,
});

const jobApplicationSchema = z.object({
  jobId: z.string().trim().min(1).max(80),
  candidateName: z.string().trim().min(2).max(40),
  phone: phoneSchema,
  school: optionalTextSchema,
  major: optionalTextSchema,
  portfolioUrl: z.string().trim().url("请输入有效的作品集链接").max(200).optional(),
  idempotencyKey: idempotencyKeySchema,
});

const contestRegistrationSchema = z.object({
  contestId: z.string().trim().min(1).max(80),
  teamName: z.string().trim().min(2).max(60),
  leaderName: z.string().trim().min(2).max(40),
  phone: phoneSchema,
  school: z.string().trim().min(2).max(80),
  memberCount: z.number().int().min(1).max(8),
  projectTitle: z.string().trim().min(2).max(100),
  idempotencyKey: idempotencyKeySchema,
});

const certificateVerifySchema = z.object({
  certificateCode: z.string().trim().min(6).max(40),
  holderName: optionalTextSchema,
});

type ParsedInput<T> = { ok: true; data: T } | { ok: false; result: ServiceResult<never> };

function failure(message: string, errors: ApiError[]): ServiceResult<never> {
  return { success: false, data: null, message, errors };
}

function parseInput<T>(schema: z.ZodType<T>, input: unknown): ParsedInput<T> {
  const parsed = schema.safeParse(input);
  if (parsed.success) return { ok: true, data: parsed.data };

  return {
    ok: false,
    result: failure(
      "请检查提交信息",
      parsed.error.issues.map((issue) => ({
        code: "VALIDATION_ERROR",
        field: issue.path.join(".") || undefined,
        message: issue.message,
      })),
    ),
  };
}

async function safeCall<T>(operation: () => Promise<ServiceResult<T>> | ServiceResult<T>) {
  try {
    return await operation();
  } catch (error) {
    console.error(error);
    return failure("服务暂时不可用，请稍后再试", [
      { code: "INTERNAL_ERROR", message: "服务暂时不可用，请稍后再试" },
    ]);
  }
}

export const getPlatformOverview = createServerFn({ method: "GET" }).handler(async () =>
  safeCall(async () => {
    const service = await import("../server/platform-service.server");
    return service.getPlatformOverview();
  }),
);

export const searchPlatform = createServerFn({ method: "POST" })
  .inputValidator(z.unknown())
  .handler(async ({ data }) =>
    safeCall(async () => {
      const parsed = parseInput(searchSchema, data);
      if (!parsed.ok) return parsed.result;

      const service = await import("../server/platform-service.server");
      return service.searchPlatform(parsed.data);
    }),
  );

export const getCourseDetail = createServerFn({ method: "POST" })
  .inputValidator(z.unknown())
  .handler(async ({ data }) =>
    safeCall(async () => {
      const parsed = parseInput(courseDetailSchema, data);
      if (!parsed.ok) return parsed.result;

      const service = await import("../server/platform-service.server");
      return service.getCourseDetail(parsed.data.courseId);
    }),
  );

export const getJobDetail = createServerFn({ method: "POST" })
  .inputValidator(z.unknown())
  .handler(async ({ data }) =>
    safeCall(async () => {
      const parsed = parseInput(jobDetailSchema, data);
      if (!parsed.ok) return parsed.result;

      const service = await import("../server/platform-service.server");
      return service.getJobDetail(parsed.data.jobId);
    }),
  );

export const getCertificationDetail = createServerFn({ method: "POST" })
  .inputValidator(z.unknown())
  .handler(async ({ data }) =>
    safeCall(async () => {
      const parsed = parseInput(certificationDetailSchema, data);
      if (!parsed.ok) return parsed.result;

      const service = await import("../server/platform-service.server");
      return service.getCertificationDetail(parsed.data.certificationId);
    }),
  );

export const getContestDetail = createServerFn({ method: "POST" })
  .inputValidator(z.unknown())
  .handler(async ({ data }) =>
    safeCall(async () => {
      const parsed = parseInput(contestDetailSchema, data);
      if (!parsed.ok) return parsed.result;

      const service = await import("../server/platform-service.server");
      return service.getContestDetail(parsed.data.contestId);
    }),
  );

export const createCourseEnrollment = createServerFn({ method: "POST" })
  .inputValidator(z.unknown())
  .handler(async ({ data }) =>
    safeCall(async () => {
      const parsed = parseInput(courseEnrollmentSchema, data);
      if (!parsed.ok) return parsed.result;

      const service = await import("../server/platform-service.server");
      return service.createCourseEnrollment(parsed.data);
    }),
  );

export const createJobApplication = createServerFn({ method: "POST" })
  .inputValidator(z.unknown())
  .handler(async ({ data }) =>
    safeCall(async () => {
      const parsed = parseInput(jobApplicationSchema, data);
      if (!parsed.ok) return parsed.result;

      const service = await import("../server/platform-service.server");
      return service.createJobApplication(parsed.data);
    }),
  );

export const createContestRegistration = createServerFn({ method: "POST" })
  .inputValidator(z.unknown())
  .handler(async ({ data }) =>
    safeCall(async () => {
      const parsed = parseInput(contestRegistrationSchema, data);
      if (!parsed.ok) return parsed.result;

      const service = await import("../server/platform-service.server");
      return service.createContestRegistration(parsed.data);
    }),
  );

export const verifyCertificate = createServerFn({ method: "POST" })
  .inputValidator(z.unknown())
  .handler(async ({ data }) =>
    safeCall(async () => {
      const parsed = parseInput(certificateVerifySchema, data);
      if (!parsed.ok) return parsed.result;

      const service = await import("../server/platform-service.server");
      return service.verifyCertificate(parsed.data);
    }),
  );

/**
 * Tests for actionWrapper utility
 *
 * These tests verify that actionWrapper properly handles different error types
 * and returns consistent ServerResponse format across all scenarios.
 */

import { Prisma } from "@prisma/client";
import { describe, expect, it } from "bun:test";
import * as yup from "yup";

import { actionWrapper } from "@/features/global/utils/action-wrapper";
import { formatSuccess } from "@/features/global/utils/format-response";

describe("actionWrapper", () => {
  it("should return success response when action succeeds", async () => {
    const result = await actionWrapper(async () => {
      return formatSuccess("Operation successful", { id: "123" });
    });

    expect(result.hasError).toBe(false);
    expect(result.message).toBe("Operation successful");
    expect(result.payload).toEqual({ id: "123" });
  });

  it("should handle Yup validation errors", async () => {
    const schema = yup.object({
      email: yup.string().email().required(),
    });

    const result = await actionWrapper(async () => {
      await schema.validate({ email: "invalid-email" });
      return formatSuccess("Success", null);
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBe(null);
    expect(result.message).toContain("email");
  });

  it("should handle Prisma unique constraint errors", async () => {
    const result = await actionWrapper(async () => {
      throw new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed",
        {
          code: "P2002",
          clientVersion: "5.0.0",
          meta: { target: ["email"] },
        }
      );
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBe(null);
    expect(result.message).toContain("already exists");
  });

  it("should handle Prisma record not found errors", async () => {
    const result = await actionWrapper(async () => {
      throw new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBe(null);
    expect(result.message).toContain("not found");
  });

  it("should handle generic errors", async () => {
    const result = await actionWrapper(async () => {
      throw new Error("Something went wrong");
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBe(null);
    expect(result.message).toBe("Something went wrong");
  });

  it("should handle unknown error types", async () => {
    const result = await actionWrapper(async () => {
      throw "String error";
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBe(null);
    expect(result.message).toBe("An unexpected error occurred");
  });

  it("should maintain ServerResponse format consistency", async () => {
    const successResult = await actionWrapper(async () => {
      return formatSuccess("Success", { data: "test" });
    });

    const errorResult = await actionWrapper(async () => {
      throw new Error("Error");
    });

    // Both should have same structure
    expect(successResult).toHaveProperty("message");
    expect(successResult).toHaveProperty("payload");
    expect(successResult).toHaveProperty("hasError");

    expect(errorResult).toHaveProperty("message");
    expect(errorResult).toHaveProperty("payload");
    expect(errorResult).toHaveProperty("hasError");
  });
});

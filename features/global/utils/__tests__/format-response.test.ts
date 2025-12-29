/**
 * Tests for format-response utilities
 *
 * These tests verify that response formatting utilities return
 * correctly structured ServerResponse objects.
 */

import { describe, test, expect } from "bun:test";
import { formatSuccess, formatError, formatResponse } from "../format-response";

describe("formatResponse", () => {
  test("should format a generic response correctly", () => {
    // Act
    const result = formatResponse("Test message", { data: "value" }, false);

    // Assert
    expect(result.message).toBe("Test message");
    expect(result.payload).toEqual({ data: "value" });
    expect(result.hasError).toBe(false);
  });

  test("should format error response with null payload", () => {
    // Act
    const result = formatResponse("Error message", null, true);

    // Assert
    expect(result.message).toBe("Error message");
    expect(result.payload).toBe(null);
    expect(result.hasError).toBe(true);
  });
});

describe("formatError", () => {
  test("should return ServerError with correct structure", () => {
    // Act
    const result = formatError("Something went wrong");

    // Assert
    expect(result.hasError).toBe(true);
    expect(result.message).toBe("Something went wrong");
    expect(result.payload).toBe(null);
  });

  test("should handle empty error message", () => {
    // Act
    const result = formatError("");

    // Assert
    expect(result.hasError).toBe(true);
    expect(result.message).toBe("");
    expect(result.payload).toBe(null);
  });
});

describe("formatSuccess", () => {
  test("should return ServerSuccess with correct structure for object payload", () => {
    // Arrange
    const payload = { id: "123", email: "user@example.com" };

    // Act
    const result = formatSuccess("User found", payload);

    // Assert
    expect(result.hasError).toBe(false);
    expect(result.message).toBe("User found");
    expect(result.payload).toEqual(payload);
  });

  test("should handle array payload", () => {
    // Arrange
    const payload = [1, 2, 3, 4, 5];

    // Act
    const result = formatSuccess("Numbers fetched", payload);

    // Assert
    expect(result.hasError).toBe(false);
    expect(result.message).toBe("Numbers fetched");
    expect(result.payload).toEqual(payload);
  });

  test("should handle string payload", () => {
    // Arrange
    const payload = "success";

    // Act
    const result = formatSuccess("Operation complete", payload);

    // Assert
    expect(result.hasError).toBe(false);
    expect(result.message).toBe("Operation complete");
    expect(result.payload).toBe(payload);
  });

  test("should handle number payload", () => {
    // Arrange
    const payload = 42;

    // Act
    const result = formatSuccess("Count retrieved", payload);

    // Assert
    expect(result.hasError).toBe(false);
    expect(result.message).toBe("Count retrieved");
    expect(result.payload).toBe(payload);
  });
});

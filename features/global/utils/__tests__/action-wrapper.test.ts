/**
 * Tests for action-wrapper utility
 *
 * These tests verify that the actionWrapper correctly handles
 * success and error cases, providing consistent response formats.
 */

import { describe, test, expect } from "bun:test";
import { actionWrapper } from "../action-wrapper";
import { formatSuccess, formatError } from "../format-response";

describe("actionWrapper", () => {
  test("should handle success case correctly", async () => {
    // Arrange
    const mockAction = async () => {
      return formatSuccess("Operation successful", { id: "123", name: "Test" });
    };

    // Act
    const result = await actionWrapper(mockAction);

    // Assert
    expect(result.hasError).toBe(false);
    expect(result.message).toBe("Operation successful");
    expect(result.payload).toEqual({ id: "123", name: "Test" });
  });

  test("should handle error case with Error instance", async () => {
    // Arrange
    const mockAction = async () => {
      throw new Error("Test error message");
    };

    // Act
    const result = await actionWrapper(mockAction);

    // Assert
    expect(result.hasError).toBe(true);
    expect(result.message).toBe("Test error message");
    expect(result.payload).toBe(null);
  });

  test("should handle error case with non-Error throw", async () => {
    // Arrange
    const mockAction = async () => {
      throw "String error";
    };

    // Act
    const result = await actionWrapper(mockAction);

    // Assert
    expect(result.hasError).toBe(true);
    expect(result.message).toBe("An unexpected error occurred");
    expect(result.payload).toBe(null);
  });

  test("should preserve error from formatError", async () => {
    // Arrange
    const mockAction = async () => {
      // Simulate a data layer throwing an error
      throw new Error("Database connection failed");
    };

    // Act
    const result = await actionWrapper(mockAction);

    // Assert
    expect(result.hasError).toBe(true);
    expect(result.message).toBe("Database connection failed");
    expect(result.payload).toBe(null);
  });
});

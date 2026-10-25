import { describe, expect, it, beforeEach } from "vitest";
import { hasAskedPermissions, markPermissionsAsked } from "@/lib/permissions";

describe("permission prompt memory", () => {
  beforeEach(() => localStorage.clear());

  it("has not asked a new account", () => {
    expect(hasAskedPermissions("user-a")).toBe(false);
  });

  it("remembers an account after it answers", () => {
    markPermissionsAsked("user-a");
    expect(hasAskedPermissions("user-a")).toBe(true);
  });

  it("asks each account separately", () => {
    markPermissionsAsked("user-a");
    expect(hasAskedPermissions("user-b")).toBe(false);
  });
});

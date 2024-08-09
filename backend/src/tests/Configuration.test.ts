import { ROUTES, getRouteSlug } from "../tools/Configuration";

describe("Configuration", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });
  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });
  test("getRouteSlug returns the configured value plus prefix", () => {
      delete process.env.ROUTE_PREFIX
      const actualResult = getRouteSlug("USERTOKEN_AP");
      expect(actualResult).toBe("/api/" + ROUTES.USERTOKEN_AP);
  });
  test("returns the configured value plus prefix", () => {
    process.env.ROUTE_PREFIX = "/opi/"
    const actualResult = getRouteSlug("USERTOKEN_AP");
    expect(actualResult).toBe("/opi/" + ROUTES.USERTOKEN_AP);
 });
 test("returns the configured value plus prefix and param", () => {
  process.env.ROUTE_PREFIX = "/opi/"
  const actualResult = getRouteSlug("CHECK_TOKEN_AP", true);
  expect(actualResult).toBe("/opi/" + ROUTES.CHECK_TOKEN_AP + ROUTES.CHECK_TOKEN_PARAM);
});
});

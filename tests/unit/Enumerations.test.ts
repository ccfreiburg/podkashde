import { describe, expect, it, afterEach } from "vitest";
import type {IEnumerator} from "../../base/types/IEnumerator";
import Enumerations from "../../base/Enumerations";

describe("enumerations", async () => {
  const list = new Array<IEnumerator>();
  list.push(
    {
      displaytext: "-1-",
      shorttext: "",
      parentCategory: "",
      enumkey_id: 1,
      enumvalue_id: 1,
    })
  list.push(
    {
      displaytext: "-3-",
      shorttext: "",
      parentCategory: "",
      enumkey_id: 2,
      enumvalue_id: 3,
    }
  );
  list.push(
    {
      displaytext: "-4-",
      shorttext: "",
      parentCategory: "",
      enumkey_id: 1,
      enumvalue_id: 4,
    }
  );

  it("getEnumeration returns only selected list", () => {
    const actual = Enumerations.getEnumeration(2,list);
    expect(actual.length).toBe(1);
    expect(actual[0].enumvalue_id).toBe(3);
  });

  it("byIdTextList returns only selected list", () => {
    const actual = Enumerations.byIdTextList(list, [3, 4]);
    expect(actual).toContain("-3-");
    expect(actual).toContain("-4-");
  });

  it("byIdOne returns only selected list", () => {
    const actual = Enumerations.byIdOne(list, 3);
    expect(actual.displaytext).toBe("-3-");
  });
});

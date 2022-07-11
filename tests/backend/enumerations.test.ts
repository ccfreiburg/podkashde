import { describe, expect, it, afterEach } from "vitest";
import Enumerator, { getEnumerator } from "../../backend/entities/Enumerator";
import { Enumerations } from "../../backend/Enumerations";

const dbFileName = "./data/testdb.sqlite";

describe.only("enumerations", async () => {
  const list = new Array<Enumerator>();
  list.push(
    getEnumerator({
      id: 1,
      displaytext: "-1-",
      enumkey_id: 1,
      enumvalue_id: 1,
    })
  );
  list.push(
    getEnumerator({
      id: 3,
      displaytext: "-3-",
      enumkey_id: 2,
      enumvalue_id: 3,
    })
  );
  list.push(
    getEnumerator({
      id: 4,
      displaytext: "-4-",
      enumkey_id: 1,
      enumvalue_id: 4,
    })
  );

  it("getEnumeration returns only selected list", () => {
    const enums = new Enumerations();
    enums.init(list);
    const actual = enums.getEnumeration(2);
    expect(actual.length).toBe(1);
    expect(actual[0].id).toBe(3);
  });

  it("byIdTextList returns only selected list", () => {
    const enums = new Enumerations();
    enums.init(list);
    const actual = Enumerations.byIdTextList(list, [3, 4]);
    expect(actual).toContain("-3-");
    expect(actual).toContain("-4-");
  });

  it("byIdOne returns only selected list", () => {
    const enums = new Enumerations();
    enums.init(list);
    const actual = Enumerations.byIdOne(list, 3);
    expect(actual.displaytext).toBe("-3-");
  });
});

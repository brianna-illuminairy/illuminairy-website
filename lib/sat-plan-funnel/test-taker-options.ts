export type TestTakerOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

export const TEST_TAKER_OPTIONS: TestTakerOption[] = [
  { id: "test_taker_daughter", label: "My daughter", ariaLabel: "My daughter is taking the SAT" },
  { id: "test_taker_son", label: "My son", ariaLabel: "My son is taking the SAT" },
  { id: "test_taker_self", label: "Me", ariaLabel: "I am taking the SAT" },
  {
    id: "test_taker_other",
    label: "Someone else",
    ariaLabel: "Someone else is taking the SAT"
  }
];

export type TestTakerId = (typeof TEST_TAKER_OPTIONS)[number]["id"];

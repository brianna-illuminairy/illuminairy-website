export type GpaOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

export const GPA_OPTIONS: GpaOption[] = [
  {
    id: "gpa_below_3",
    label: "Below 3.0",
    ariaLabel: "GPA below 3.0"
  },
  {
    id: "gpa_3_3_5",
    label: "3.0–3.5",
    ariaLabel: "GPA 3.0 to 3.5"
  },
  {
    id: "gpa_3_5_3_8",
    label: "3.5–3.8",
    ariaLabel: "GPA 3.5 to 3.8"
  },
  {
    id: "gpa_3_8_4",
    label: "3.8–4.0",
    ariaLabel: "GPA 3.8 to 4.0"
  },
  {
    id: "gpa_4_plus",
    label: "4.0+",
    ariaLabel: "GPA 4.0 or higher"
  }
];

export type GpaId = (typeof GPA_OPTIONS)[number]["id"];

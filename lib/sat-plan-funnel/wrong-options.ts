export type WrongOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

export type WrongCategory = {
  id: string;
  label: string;
  options: WrongOption[];
};

export const WRONG_CATEGORIES: WrongCategory[] = [
  {
    id: "time",
    label: "Time",
    options: [
      {
        id: "wrong_time_ran_out",
        label: "Ran out of time",
        ariaLabel: "Ran out of time on the test"
      },
      {
        id: "wrong_time_rushed",
        label: "Rushed and guessed at the end",
        ariaLabel: "Rushed and guessed at the end"
      },
      {
        id: "wrong_time_stuck",
        label: "Got stuck on hard questions too long",
        ariaLabel: "Got stuck on hard questions too long"
      }
    ]
  },
  {
    id: "focus",
    label: "Focus",
    options: [
      {
        id: "wrong_focus_lost",
        label: "Lost focus during the test",
        ariaLabel: "Lost focus during the test"
      },
      {
        id: "wrong_focus_exhausted",
        label: "Mentally exhausted before it was over",
        ariaLabel: "Mentally exhausted before it was over"
      }
    ]
  },
  {
    id: "anxiety",
    label: "Anxiety",
    options: [
      {
        id: "wrong_anxiety_froze",
        label: "Froze or panicked",
        ariaLabel: "Froze or panicked on test day"
      },
      {
        id: "wrong_anxiety_second_guess",
        label: "Second-guessed answers",
        ariaLabel: "Second-guessed answers"
      },
      {
        id: "wrong_anxiety_couldnt_perform",
        label: "Knows the material but couldn't perform",
        ariaLabel: "Knows the material but could not perform on test day"
      }
    ]
  },
  {
    id: "content",
    label: "Content",
    options: [
      {
        id: "wrong_content_math",
        label: "Struggled with math topics",
        ariaLabel: "Struggled with math topics"
      },
      {
        id: "wrong_content_reading",
        label: "Struggled with reading passages",
        ariaLabel: "Struggled with reading passages"
      },
      {
        id: "wrong_content_grammar",
        label: "Struggled with grammar questions",
        ariaLabel: "Struggled with grammar questions"
      },
      {
        id: "wrong_content_wording",
        label: "Questions worded differently than school",
        ariaLabel: "Questions worded differently than school"
      }
    ]
  },
  {
    id: "prep",
    label: "Prep",
    options: [
      {
        id: "wrong_prep_no_full_tests",
        label: "Didn't take full-length practice tests",
        ariaLabel: "Did not take full-length practice tests"
      },
      {
        id: "wrong_prep_cramming",
        label: "Only studied a few days/weekends",
        ariaLabel: "Only studied a few days or weekends"
      },
      {
        id: "wrong_prep_unprepared",
        label: "Didn't know what to expect",
        ariaLabel: "Did not know what to expect on test day"
      }
    ]
  }
];

export const ALL_WRONG_OPTION_IDS = WRONG_CATEGORIES.flatMap((cat) =>
  cat.options.map((opt) => opt.id)
);

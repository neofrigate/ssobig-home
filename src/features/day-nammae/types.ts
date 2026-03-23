export interface ScheduleItem {
  date: string;
  title: string;
  applicants: {
    total: number;
    female: number;
    male: number;
  };
  maxCapacity: number;
  status: string;
}

export interface DayNammeFormValues {
  gender: "남" | "여" | "";
  schedule: string;
  name: string;
  birthYear: string;
  height: string;
  phone: string;
  traits: string;
  photo: File | null;
}

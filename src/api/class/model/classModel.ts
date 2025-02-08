export interface CreateClassParams {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  hour: string;
  students: { id: string }[];
}

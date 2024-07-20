import { DocumentData } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bank: {
    bankName: string;
    iban: string;
    accountNumber: string;
    swiftCode: string;
  };
  btcAddress: string;
  currentInvestments: Investment[];
  createdAt: string;
  isAdmin: boolean;
  birthday: number;
} & DocumentData;

export type Plan = {
  id: string;
  title: string;
  ROI: string;
  description: string;
  price: string;
  duration: number;
  createdAt: string;
} & DocumentData;

export type Transaction = {
  type: "WITHDRAWAL" | "INVESTMENT";
  id: string;
  createdAt: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  user: Pick<User, "id" | "name" | "email">;
  method?: {
    value: string;
    label: string | "BTC";
  };
} & DocumentData;

export type Investment = {
  id: string;
  user: Pick<User, "name" | "id" | "phone">;
  createAt: string;
  plan: Pick<Plan, "id" | "title" | "id" | "ROI" | "duration">;
  withdrawalDate: string;
  earnings: number;
  capital: number;
  status:
    | "CREATED"
    | "PROCESSING"
    | "PAUSED"
    | "ACCEPTED"
    | "REJECTED"
    | "CANCELED";
} & DocumentData;

export function addDaysToDate(date: Date, daysToAdd: number): Date {
  const newDate = new Date(date.getTime()); // Create a copy to avoid modifying original
  newDate.setDate(newDate.getDate() + daysToAdd);
  return newDate;
}

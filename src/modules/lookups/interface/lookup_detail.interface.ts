import { ObjectId } from "mongodb";

export interface LookupDetail {
  id: ObjectId;
  code: string;
  name: string;
}
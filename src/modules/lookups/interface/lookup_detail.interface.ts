import { ObjectId } from "mongodb";

export interface LookupDetail {
  id: ObjectId;
  code: string;
  name: string;
}

export interface GetLookupDetail {
  lookup: {
    id: string;
    name: string;
    code: string;
  },
  lookup_detail: {
    id: string;
    name: string;
    code: string;
  }
}
// @flow
export type CategoryWagerType =
  | "up_to_twenty_five"
  | "one_through_six"
  | "admin_choice";
export type CategoryType = {
  uid: string,
  name: string,
  nameInsensitive: string,
  order: number,
  createdAt: Date,
  wagerType: CategoryWagerType
};

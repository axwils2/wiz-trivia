// @flow
export type CategoryWagerType =
  | "upToTwentyFive"
  | "oneThroughSix"
  | "adminChoice";
export type CategoryType = {
  uid: string,
  name: string,
  nameInsensitive: string,
  order: number,
  createdAt: Date,
  wagerType: CategoryWagerType
};

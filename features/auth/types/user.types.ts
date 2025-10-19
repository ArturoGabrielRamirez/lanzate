import { Account, User } from "@prisma/client";

export type LocalUserType = User & { Account: Account[] }
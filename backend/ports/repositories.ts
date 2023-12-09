import Container, { Token } from "typedi";
import { Machine } from "../entities/Machine";
import { MachineDataPoint } from "../entities/MachineDataPoint";
import { MachineDataType } from "../entities/MachineDataType";
import { MachineDataPointRepositoryImpl } from "../repositories/MachineDataPointRepository";
import { MachineDataTypeRepositoryImpl } from "../repositories/MachineDataTypeRepository";
import { MachineRepositoryImpl } from "../repositories/MachineRepository";
import { Pagination } from "../shared/pagination";
import { Result } from "../shared/result";
import { User } from "../entities/User";
import { UserRepositoryImpl } from "../repositories/UserRepository";

export const MachineRepositoryToken = new Token("MachineRepository");
export const MachineDataTypeRepositoryToken = new Token(
  "MachineDataTypesRepository",
);
export const MachineDataPointRepositoryToken = new Token(
  "MachineDataPointsRepository",
);
export const UserRepositoryToken = new Token("UserRepositoryToken");

Container.set<MachineRepository>(
  MachineRepositoryToken,
  Container.get<MachineRepository>(MachineRepositoryImpl),
);
Container.set(
  MachineDataTypeRepositoryToken,
  Container.get<MachineDataTypesRepository>(MachineDataTypeRepositoryImpl),
);
Container.set(
  MachineDataPointRepositoryToken,
  Container.get<MachineDataPointsRepository>(MachineDataPointRepositoryImpl),
);
Container.set(
  UserRepositoryToken,
  Container.get<UserRepository>(UserRepositoryImpl),
);

export interface MachineRepository {
  create(entity: Machine): Promise<Result<Machine>>;
  delete(id: number): Promise<Result<Machine>>;
  update(entity: Machine): Promise<Result<Machine>>;
  getById(id: number): Promise<Result<Machine>>;
  list(take: number, skip: number): Promise<Result<Pagination<Machine>>>;
}

export interface MachineDataTypesRepository {
  create(entity: MachineDataType): Promise<Result<MachineDataType>>;
  delete(id: number): Promise<Result<MachineDataType>>;
  update(entity: MachineDataType): Promise<Result<MachineDataType>>;
  getById(id: number): Promise<Result<MachineDataType>>;
  list(
    take: number,
    skip: number,
  ): Promise<Result<Pagination<MachineDataType>>>;
}

export interface MachineDataPointsRepository {
  create(entity: MachineDataPoint): Promise<Result<MachineDataPoint>>;
  delete(id: number): Promise<Result<MachineDataPoint>>;
  getById(id: number): Promise<Result<MachineDataPoint>>;
  list(
    take: number,
    skip: number,
  ): Promise<Result<Pagination<MachineDataPoint>>>;
}

export interface UserRepository {
  create(entity: User): Promise<Result<User>>;
  getByEmail(email: string): Promise<Result<User>>;
}

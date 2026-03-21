import { Brand } from "../entities/Brand";

export interface IBrandRepository {
  findAll(): Promise<Brand[]>;
  findById(id: number): Promise<Brand | null>;
  create(name: string): Promise<Brand>;
  update(id: number, name: string): Promise<Brand | null>;
  delete(id: number): Promise<boolean>;
}
import { prisma } from "../config/database";
import { Request, Response } from "express";

const categories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500);
  }
};

const statuses = async (req: Request, res: Response) => {};

const requirements = async (req: Request, res: Response) => {};

const accountTypes = async (req: Request, res: Response) => {
  try {
    const accountTypes = await prisma.accountType.findMany();
    res.status(200).json(accountTypes);
  } catch (error) {
    res.status(500);
  }
};

export { categories, statuses, requirements, accountTypes };

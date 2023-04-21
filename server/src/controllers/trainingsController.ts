import { prisma } from "../config/database";
import { Request, Response } from "express";

const trainingsController = {
  getAllTrainings: async (req: Request, res: Response, err: any) => {
    const { requirement } = req.query;
    console.log(requirement);
    try {
      const allTrainings = await prisma.training.findMany({
        where: {
          ...(requirement ? { requirement: Number(requirement) } : {}),
        },
        orderBy: {
          id: "asc",
        },
        include: {
          requirements: {
            select: {
              name: true,
            },
          },
          trainees: {
            where: { status: 1 },
            include: {
              trainees: true,
            },
          },
        },
      });
      res.status(200).json(allTrainings);
    } catch (err) {
      res.status(500).json({ err });
    }
  },

  showTraining: async (req: Request, res: Response, err: any) => {
    try {
      const id = parseInt(req.params.id);
      const training = await prisma.training.findUnique({
        where: { id },
        select: {
          id: true,
          start: true,
          end: true,
          capacity: true,
          complete: true,
          instruction: true,
          requirements: {
            select: {
              name: true,
            },
          },
          trainees: {
            select: {
              trainees: {
                select: {
                  callsign: true,
                  categories: {
                    select: {
                      name: true,
                    },
                  },
                  currencies: {
                    select: {
                      expiry: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      console.log(training);
      res.status(200).json(training);
    } catch (err) {
      res.status(500).json({ err });
    }
  },

  updateTraining: async (req: Request, res: Response, err: any) => {
    try {
      const id = parseInt(req.params.id);
      const { name, start, end, capacity, instruction } = req.body;
      const updatedTraining = await prisma.training.update({
        where: { id },
        data: {
          start,
          end,
          capacity,
          instruction,
          requirements: {
            update: {
              name: name,
            },
          },
        },
        select: {
          id: true,
          start: true,
          end: true,
          capacity: true,
          instruction: true,
          requirements: {
            select: {
              name: true,
            },
          },
        },
      });
      res.status(200).json(updatedTraining);
    } catch (err) {
      res.status(500).json({ err });
    }
  },

  deleteTraining: async (req: Request, res: Response, err: any) => {
    try {
      const id = parseInt(req.params.id);
      await prisma.training.delete({
        where: { id },
      });
      res.status(200).json({ message: "Training deleted successfully" });
    } catch (err) {
      res.status(500).json({ err });
    }
  },

  createTraining: async (req: Request, res: Response, err: any) => {
    try {
      const { start, end, capacity, instruction, requirement } = req.body;
      const newTraining = await prisma.training.create({
        data: {
          start: start,
          end: end,
          capacity: parseInt(capacity),
          instruction: instruction,
          requirement: parseInt(requirement),
          complete: false,
        },
      });
      res.status(200).json(newTraining);
    } catch (err) {
      res.status(500).json({ err });
    }
  },
};
export default trainingsController;

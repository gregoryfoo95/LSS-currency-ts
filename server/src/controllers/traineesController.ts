import { Account, MONTHS_TO_RECORD_WITHDRAWAL } from "../constants";
import { Request, Response } from "express";
import { prisma } from "../config/database";
import dayjs from "dayjs";
import { trimCurrencies, trimRequirements } from "../utilities/trimTrainee";

const index = async (req: Request, res: Response) => {
  const { training } = req.query;

  try {
    const trainees = await prisma.trainee.findMany({
      where: training
        ? {
            trainings: {
              some: {
                training: Number(training),
              },
            },
            users: { approved: true },
          }
        : {},
      select: {
        id: true,
        callsign: true,
        category: true,
        user: true,
        users: { select: { approved: true } },
        categories: {
          select: {
            name: true,
            requirements: {
              select: {
                requirements: {
                  select: {
                    id: true,
                    seniorExtension: true,
                  },
                },
              },
            },
          },
        },
        currencies: training
          ? {
              where: {
                requirements: {
                  trainings: {
                    some: {
                      id: Number(training),
                    },
                  },
                },
              },
            }
          : { select: { expiry: true, seniority: true, requirement: true } },
        trainings: training
          ? {
              where: { training: Number(training) },
              select: { statuses: { select: { name: true } } },
              orderBy: { training: "asc" },
            }
          : {
              select: {
                training: true,
                status: true,
                trainings: { select: { requirement: true, start: true } },
              },
            },
      },
    });
    if (!trainees) return res.status(400);
    if (training) return res.status(200).json(trainees);

    trainees.map((trainee) => {
      trainee.categories.requirements = trimRequirements(trainee);
      trainee.currencies = trimCurrencies(trainee);
      return trainee;
    });
    res.status(200).json(trainees);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

const show = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const trainee = await prisma.trainee.findUnique({
      where: { id: Number(id) },
      select: {
        category: true,
        callsign: true,
        user: true,
        users: {
          select: {
            approved: true,
          },
        },
        categories: {
          select: {
            name: true,
            requirements: {
              select: {
                requirements: {
                  select: {
                    id: true,
                    name: true,
                    hasSeniority: true,
                    seniorExtension: true,
                  },
                },
              },
            },
          },
        },
        currencies: {
          select: {
            id: true,
            requirement: true,
            requirements: { select: { name: true } },
            seniority: true,
            expiry: true,
          },
          orderBy: {
            expiry: "asc",
          },
        },
      },
    });
    if (trainee) {
      trainee.categories.requirements = trimRequirements(trainee);
      trainee.currencies = trimCurrencies(trainee);
      res.status(200).json(trainee);
    } else {
      res.status(404);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

const showBooking = async (req: Request, res: Response) => {
  const { id, requirementId } = req.params;

  try {
    const booking = await prisma.traineeToTraining.findFirst({
      where: {
        trainee: Number(id),
        trainings: {
          requirement: Number(requirementId),
          complete: false,
          start: { gte: dayjs().toDate() },
        },
        status: { in: [1, 6] },
      },
      select: {
        status: true,
        trainings: {
          select: { start: true },
        },
      },
    });
    if (booking) {
      res.status(200).json(booking);
    } else {
      res.status(204).json({ message: "no bookings found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { callsign, category, user } = req.body;
    console.log("req.body", req.body);
    const newTrainee = await prisma.trainee.create({
      data: {
        callsign: callsign,
        category: Number(category),
        user: Number(user),
      },
    });
    res.status(200).json(newTrainee);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const { id, trainingId } = req.params;

  try {
    console.log("attempt booking");
    const booking = await book(Number(id), Number(trainingId));
    res.status(200).json(booking);
  } catch (error) {
    res.status(500);
  }

  console.log(`trainee: ${id}, training: ${trainingId}`);
};

const book = async (traineeId: number, trainingId: number) => {
  const existingBooking = await prisma.traineeToTraining.findFirst({
    where: { trainee: traineeId, training: trainingId },
    include: {
      trainings: {
        select: {
          start: true,
        },
      },
    },
  });
  if (existingBooking && existingBooking.status !== 4) {
    console.log("delete booking");
    if (
      dayjs()
        .add(MONTHS_TO_RECORD_WITHDRAWAL, "months")
        .isAfter(dayjs(existingBooking.trainings.start))
    ) {
      console.log("record withdrawal");
      return await prisma.traineeToTraining.update({
        where: { id: existingBooking.id },
        data: { status: 4, updatedAt: dayjs().toDate() },
      });
    }
    console.log("withdraw without recording");
    return await prisma.traineeToTraining.delete({
      where: { id: existingBooking.id },
    });
  }

  const training = await prisma.training.findUnique({
    where: { id: trainingId },
    select: {
      capacity: true,
      trainees: { select: { id: true } },
      requirement: true,
    },
  });

  let status = 1;
  if (training && training?.trainees.length >= training?.capacity) {
    status = 6;
  }
  console.log("make booking. status: ", status);
  const upsertTransaction = prisma.traineeToTraining.upsert({
    where: {
      trainee_training: {
        trainee: traineeId,
        training: trainingId,
      },
    },
    update: {
      status: status,
      updatedAt: dayjs().toDate(),
    },
    create: {
      trainee: traineeId,
      training: trainingId,
      status: status,
    },
  });
  const deleteOtherBookingsTransaction = prisma.traineeToTraining.deleteMany({
    where: {
      trainee: traineeId,
      training: { not: trainingId },
      trainings: { requirement: training?.requirement },
      status: { in: [1, 6] },
    },
  });

  const fulfilments = await Promise.all([
    upsertTransaction,
    deleteOtherBookingsTransaction,
  ]);
  return fulfilments[0];
};

const update = async (req: Request, res: Response) => {
  console.log("Update trainee");
  const trainee = req.body;
  const { id: traineeId } = req.params;

  const upsertCurrencies = trainee.currencies?.map((c: any) => {
    console.log(c);
    const upsertTransaction = prisma.currency.upsert({
      where: {
        trainee_requirement: {
          trainee: Number(traineeId),
          requirement: c.requirement,
        },
      },
      update: {
        expiry: c.expiry,
        seniority: c.seniority || false,
        updatedAt: dayjs().toDate(),
      },
      create: {
        expiry: c.expiry,
        seniority: c.seniority || false,
        trainees: {
          connect: {
            id: Number(traineeId),
          },
        },
        requirements: {
          connect: {
            id: c.requirement,
          },
        },
      },
    });
    return upsertTransaction;
  });

  const updateTrainee = prisma.trainee.update({
    where: { id: Number(traineeId) },
    data: {
      callsign: trainee.callsign,
      category: Number(trainee.category),
      updatedAt: dayjs().toDate(),
    },
  });

  try {
    await updateTrainee;
    if (upsertCurrencies.length) {
      await Promise.all(upsertCurrencies);
    }
    res.status(200).send("updated");
  } catch (error) {
    console.log(error);
    res.status(500).send("unable to update");
  }
};

const deleteController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const trainee = await prisma.trainee.findUnique({
      where: { id: Number(id) },
      select: { users: { select: { id: true, accountType: true } } },
    });
    const userId = trainee?.users.id;

    const deleteCurrencies = prisma.currency.deleteMany({
      where: {
        trainee: Number(id),
      },
    });
    const deleteTrainings = prisma.traineeToTraining.deleteMany({
      where: {
        trainee: Number(id),
      },
    });
    const deleteTrainee = prisma.trainee.delete({
      where: {
        id: Number(id),
      },
    });

    await prisma.$transaction([
      deleteCurrencies,
      deleteTrainings,
      deleteTrainee,
    ]);
    if (trainee?.users.accountType === Account.Trainee) {
      await prisma.user.delete({ where: { id: Number(userId) } });
    }
    res.status(200);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const checkin = async (req: Request, res: Response) => {
  console.log("handle checkin");
  const { passphrase } = req.body;
  const { user: userId, training: trainingId } = req.query;

  try {
    const trainee = await prisma.trainee.findUnique({
      where: { user: Number(userId) },
    });
    const training = await prisma.training.findUnique({
      where: { id: Number(trainingId) },
    });

    const isCorrectPassphrase = passphrase === training?.passphrase;
    const isSameDay = dayjs(training?.start).isSame(dayjs(), "day");

    if (trainee && isCorrectPassphrase && isSameDay) {
      await prisma.traineeToTraining.update({
        where: {
          trainee_training: {
            trainee: trainee?.id,
            training: Number(trainingId),
          },
        },
        data: { status: 2, updatedAt: dayjs().toDate() },
      });
      return res.status(200).json({ message: "Check in successful!" });
    } else {
      return res
        .status(400)
        .json({ message: "Check in unsucessful. Please try again." });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export {
  index,
  show,
  showBooking,
  create,
  update,
  updateBooking,
  checkin,
  deleteController as delete,
};

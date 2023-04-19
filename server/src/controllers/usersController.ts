import { prisma } from "../config/database";
import { Request, Response } from "express";

const usersController = {
    getAllUsers: async (err: any, res: Response) => {
        try {
            const allUsers = await prisma.user.findMany({
                orderBy: {
                    id: "asc"
                }
            })
            res.status(200).json(allUsers);
        } catch (err) {
            res.status(500).json({err});
        }
    },

    getUserById: async(req: Request, res: Response, err: any) => {
        try {
            const id = parseInt(req.params.id);

            const userData = await prisma.user.findUniqueOrThrow({
                where: { id },
                select: {
                    id: true,
                    displayName: true,
                    accountType: true,
                    approved: true,
                },
            });
            console.log(userData);
            res.status(200).json(userData);
        } catch (err) {
            res.status(500).json({err});
        }
    },

    updateUserById: async(req: Request, res: Response, err: any) => {
        try {
            const id = parseInt(req.params.id);
            const {displayName, accountType, approved } = req.body;
            console.log(approved);
            const updatedData = await prisma.user.update({
                where: { id },
                data: { displayName, accountType, approved},
                select: {
                    id: true,
                    displayName: true,
                    accountType: true,
                    approved: true,
                },
            });
            res.status(200).json(updatedData);
        } catch (err) {
            res.status(500).json({err})
        }
    },

    deleteUserById: async (req: Request, res: Response, err: any) => {
        try {
            const id = parseInt(req.params.id);
            await prisma.user.delete({
                where: { id },
            })
            res.status(200).json({message: "User deleted successfully"});
        } catch (err) {
            res.status(500).json({err})
        }
    }
}


export default usersController;
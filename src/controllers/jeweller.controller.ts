import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendCreated } from "../utils/response";
import { logger } from "../lib/logger";
import { jewellerService } from "../services/jeweller.service";

const getAllJewellers = asyncHandler(async (req: Request, res: Response) => {
  const data = await jewellerService.getAllJewellers();
  sendSuccess(res, data, "Jewellers fetched successfully");
});

const getJewellerById = asyncHandler(async (req: Request, res: Response) => {
  const data = await jewellerService.getJewellerById(Number(req.params.id));
  sendSuccess(res, data, "Jeweller fetched successfully");
});

const createJeweller = asyncHandler(async (req: Request, res: Response) => {
  const data = await jewellerService.createJeweller(req.body);
  logger.info("Jeweller created", { id: data.id, by: req.user?.userId });
  sendCreated(res, data, "Jeweller created successfully");
});

const approveJeweller = asyncHandler(async (req: Request, res: Response) => {
  const data = await jewellerService.approveJeweller(Number(req.params.id));
  logger.info("Jeweller approved", { id: data.id, by: req.user?.userId });
  sendSuccess(res, data, "Jeweller approved successfully");
});

export const jewellerController = {
  getAllJewellers,
  getJewellerById,
  createJeweller,
  approveJeweller,
};

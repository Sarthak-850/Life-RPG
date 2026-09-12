import { Response } from 'express';
import prisma from '../config/database.js';
import { AuthenticatedRequest } from '../types/index.js';

export class HistoryController {
  static async getHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const type = req.query.type as string;

    const skip = (page - 1) * limit;

    const whereClause: any = { userId };
    if (type) {
      whereClause.type = type;
    }

    const [total, logs] = await Promise.all([
      prisma.activityLog.count({ where: whereClause }),
      prisma.activityLog.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const formattedLogs = logs.map((log) => ({
      ...log,
      metadata: log.metadata ? JSON.parse(log.metadata) : null,
    }));

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      logs: formattedLogs,
    });
  }
}

export default HistoryController;

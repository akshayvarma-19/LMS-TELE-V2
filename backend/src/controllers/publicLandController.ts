import { Request, Response } from 'express';
import { publicLandService } from '../services/publicLandService.js';

export const publicLandController = {
  /**
   * Controller for public search.
   */
  async searchPublicLands(req: Request, res: Response): Promise<void> {
    try {
      const { survey_number, village, taluk, district, page, limit } = req.query;

      // Extract and trim supported filter parameters
      const filterSurveyNumber = typeof survey_number === 'string' ? survey_number.trim() : undefined;
      const filterVillage = typeof village === 'string' ? village.trim() : undefined;
      const filterTaluk = typeof taluk === 'string' ? taluk.trim() : undefined;
      const filterDistrict = typeof district === 'string' ? district.trim() : undefined;

      // Validate that at least one search criterion is provided
      if (!filterSurveyNumber && !filterVillage && !filterTaluk && !filterDistrict) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Please provide at least one search criterion.',
            code: 'SEARCH_CRITERIA_REQUIRED'
          }
        });
        return;
      }

      // Default pagination values
      let parsedPage = 1;
      let parsedLimit = 20;

      // Validate page if provided
      if (page !== undefined) {
        const pageNum = Number(page);
        if (isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum < 1) {
          res.status(400).json({
            success: false,
            error: {
              message: 'Page parameter must be an integer greater than or equal to 1.',
              code: 'INVALID_PAGINATION_PAGE'
            }
          });
          return;
        }
        parsedPage = pageNum;
      }

      // Validate limit if provided
      if (limit !== undefined) {
        const limitNum = Number(limit);
        if (isNaN(limitNum) || !Number.isInteger(limitNum) || limitNum < 1 || limitNum > 50) {
          res.status(400).json({
            success: false,
            error: {
              message: 'Limit parameter must be an integer between 1 and 50.',
              code: 'INVALID_PAGINATION_LIMIT'
            }
          });
          return;
        }
        parsedLimit = limitNum;
      }

      // Execute search query
      const result = await publicLandService.searchPublicLands(
        {
          survey_number: filterSurveyNumber,
          village: filterVillage,
          taluk: filterTaluk,
          district: filterDistrict
        },
        parsedPage,
        parsedLimit
      );

      res.status(200).json({
        success: true,
        data: result.records,
        pagination: result.pagination
      });
    } catch (err: any) {
      // Do not expose internal database error details, log locally instead
      console.error('Public Search Error:', err);
      res.status(500).json({
        success: false,
        error: {
          message: 'An error occurred while searching public land records.',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
};

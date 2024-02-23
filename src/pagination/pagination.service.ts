import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  async paginate(resultData, options) {
    const { page = 1, limit = 10, sort } = options;

    const skip = (page - 1) * limit;

    // Clone the resultData array to ensure we don't modify the original data
    const clonedResultData = [...resultData?.data];

    // Create a sorting object based on the 'sort' parameter
    if (sort) {
      const sorting = {};
      const sortFields = sort.split(',');

      sortFields.forEach((sortField) => {
        const [field, order] = sortField.split(':');
        sorting[field] = order === 'desc' ? -1 : 1;
      });

      // Sort the clonedResultData array
      clonedResultData.sort((a, b) => {
        for (const field of Object.keys(sorting)) {
          const sortOrder = sorting[field];
          if (a[field] < b[field]) return -1 * sortOrder;
          if (a[field] > b[field]) return 1 * sortOrder;
        }
        return 0;
      });
    }

    // Calculate the total count (for metadata)
    const total = clonedResultData.length;

    // Get the paginated data (convert the incoming string to numbers)
    const data = clonedResultData.slice(skip, skip + +limit);

    const totalPages = Math.ceil(total / limit);

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    // Check if the data array is empty
    if (data.length === 0) {
      // Handle the case when there are no items in the paginated data
      return {
        data: [],
        status: 404,
        success: false,
        message: 'no data found',
      };
    }

    return {
      data: data,
      status: 200,
      success: true,
      message: 'data found',
      pagination: {
        total,
        limit,
        page,
        totalPages,
        hasPrevPage,
        hasNextPage,
      },
    };
  }
}

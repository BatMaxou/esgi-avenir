import { ApiClientError } from "../../../../application/services/api/ApiClientError";

export const handleApiError = async (response: Response): Promise<Response> => {
  if (!response.ok) {
    throw new ApiClientError(response.status, response.statusText);
  }

  return response;
};

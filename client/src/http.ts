import { ZodSchema } from 'zod';

const API_URL =
  typeof window === 'undefined'
    ? process.env.API_URL // Server-side
    : process.env.NEXT_PUBLIC_API_URL; // Client-side

export const fetchWithAuth = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('accessToken');

  // Create a Headers instance from init.headers if it exists, or create a new one
  const headers = new Headers(init.headers);

  // Set the Authorization header if the token exists
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Check if the body is FormData
  const isFormData = init.body instanceof FormData;

  // Only set Content-Type to 'application/json' if not sending FormData and Content-Type isn't already set
  if (!headers.has('Content-Type') && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  // Make the fetch request with the updated headers
  const response = await fetch(input, {
    ...init,
    headers, // Pass the Headers instance
  });

  // Optional: Handle unauthorized responses
  if (response.status === 401) {
    // Remove the invalid token
    localStorage.removeItem('accessToken');
    // Redirect to login page
    window.location.href = '/login';
  }

  return response;
};

export async function fetchData<T>(
  url: string,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const response = await fetchWithAuth(`${API_URL}/${url}`);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return schema.parse(data);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch data: ${(error as Error).message}`);
  }
}

export async function postData<T, U>(
  url: string,
  schema: ZodSchema<T>,
  data: U | FormData
): Promise<T> {
  try {
    const isFormData = data instanceof FormData;

    const response = await fetchWithAuth(`${API_URL}/${url}`, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit data');
    }

    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      const responseData = await response.json();
      return schema.parse(responseData);
    } else if (response.status === 204) {
      // Return a default value for void responses
      return '' as unknown as T;
    } else {
      const responseData = await response.text();
      if (responseData) {
        // Handle plain text response directly
        if (typeof responseData === 'string') {
          return responseData as unknown as T;
        }

        // Attempt schema parsing for JSON-like text
        return schema.parse(JSON.parse(responseData));
      }
    }

    // Fallback in case of unexpected situations
    return '' as unknown as T;
  } catch (error) {
    throw new Error(`Failed to submit data: ${(error as Error).message}`);
  }
}

export async function putData<T, U>(
  url: string,
  schema: ZodSchema<T> | null,
  data: U | FormData
): Promise<T | void> {
  try {
    const isFormData = data instanceof FormData;

    const response = await fetchWithAuth(`${API_URL}/${url}`, {
      method: 'PUT',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Resource not found');
      } else if (response.status === 400) {
        throw new Error('Validation error occurred');
      }
      throw new Error('Failed to update data');
    }

    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      const responseData = await response.json();
      return schema ? schema.parse(responseData) : (responseData as T);
    } else if (response.status === 204) {
      // No content to return
      return;
    } else {
      const responseData = await response.text();
      if (responseData) {
        // Handle plain text response directly
        if (typeof responseData === 'string') {
          return schema
            ? schema.parse(responseData)
            : (responseData as unknown as T);
        }

        // Attempt schema parsing for JSON-like text
        return schema
          ? schema.parse(JSON.parse(responseData))
          : (responseData as T);
      }
    }
  } catch (error) {
    throw new Error(`Failed to update data: ${(error as Error).message}`);
  }
}

export async function deleteData(url: string): Promise<void> {
  try {
    const response = await fetchWithAuth(`${API_URL}/${url}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Resource not found');
      }
      throw new Error('Failed to delete data');
    }
  } catch (error) {
    throw new Error(`Failed to delete data: ${(error as Error).message}`);
  }
}

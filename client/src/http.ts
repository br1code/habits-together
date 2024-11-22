import { ZodSchema } from 'zod';

const API_URL =
  typeof window === 'undefined'
    ? process.env.API_URL // Server-side
    : process.env.NEXT_PUBLIC_API_URL; // Client-side

export async function fetchData<T>(
  url: string,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const response = await fetch(`${API_URL}/${url}`);

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

    const response = await fetch(`${API_URL}/${url}`, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit data');
    }

    const contentType = response.headers.get('Content-Type') || '';
    const responseData = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    return schema.parse(responseData);
  } catch (error) {
    throw new Error(`Failed to submit data: ${(error as Error).message}`);
  }
}

export async function putData<T, U>(url: string, data: U): Promise<T> {
  try {
    const response = await fetch(`${API_URL}/${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Resource not found');
      } else if (response.status === 400) {
        throw new Error('Validation error occurred');
      }
      throw new Error('Failed to update data');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error(`Failed to update data: ${(error as Error).message}`);
  }
}

export async function deleteData(url: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${url}`, {
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

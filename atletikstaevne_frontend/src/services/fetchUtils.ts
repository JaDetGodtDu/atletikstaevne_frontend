export function makeOptions(method: string, body: object) {
  const options: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  return options;
}

export async function handleHttpErrors(response: Response) {
  if (!response.ok) {
    const responseError = await response.json();
    const msg = responseError.message;
    throw new Error(msg);
  }
  return response.json();
}

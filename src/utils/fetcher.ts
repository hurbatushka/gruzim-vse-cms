export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
  }

  return response.json();
};

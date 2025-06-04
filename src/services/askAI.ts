export const askAI = async (message: string): Promise<string> => {
  const res = await fetch('http://localhost:5000/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  return data.content;
};

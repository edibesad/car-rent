export function setToSessionStorage(key: string, value: any) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function getFromSessionStorage(key: string) {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

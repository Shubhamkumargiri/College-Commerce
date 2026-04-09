export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.items)) return value.items;
  if (value && Array.isArray(value.data)) return value.data;
  if (value && Array.isArray(value.products)) return value.products;
  if (value && Array.isArray(value.users)) return value.users;
  if (value && Array.isArray(value.listings)) return value.listings;
  if (value && Array.isArray(value.conversations)) return value.conversations;
  if (value && Array.isArray(value.messages)) return value.messages;
  return [];
}

export function parseError(e) {
  // regex to match the prisma error code, e.g. P2025
  switch (e.code) {
    case "P2002":
      return "Duplicate name or id";
    case "P2025":
      return "Foreign key constraint failed";
    default:
      return e.message;
  }
}

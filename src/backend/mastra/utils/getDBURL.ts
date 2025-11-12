import path from "node:path";

export function getDBURL(name: string) {
  return `file: ${path.resolve(process.cwd(), `${name}.db`)}`;
}

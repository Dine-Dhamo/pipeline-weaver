/**
 * Extract variable names from text using a regex pattern
 * @param text - The text to search for variables
 * @param pattern - Regex pattern with capturing group for variable name
 * @returns Array of unique variable names found
 */
export function extractVariables(
  text: string | undefined | null,
  pattern: RegExp
): string[] {
  if (!text) return [];

  const variables: string[] = [];
  const regex = new RegExp(pattern.source, pattern.flags);
  let match;

  while ((match = regex.exec(text)) !== null) {
    const varName = match[1];
    if (varName && !variables.includes(varName)) {
      variables.push(varName);
    }
  }

  return variables;
}

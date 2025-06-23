/**
 * Simple template formatter to replace {{key}} placeholders in messages.
 */
export function format(template: string, vars: Record<string, any>): string {
    return template.replace(/{{\s*(\w+)\s*}}/g, (_match, key) => {
        const value = vars[key];
        return value !== undefined ? String(value) : "";
    });
}

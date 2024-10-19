export function classNames(classes: { [key: string]: boolean | void }) {
    return Object.entries(classes)
        .filter(([k, v]) => v) // stops extra space
        .map(([k]) => k)
        .join(" ");
}

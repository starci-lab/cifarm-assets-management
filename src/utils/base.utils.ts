export type WithKey<T> = T & { key: string }

export const valuesWithKey = <T extends object>(
    object: Record<string, T>
): Array<WithKey<T>> => {
    return Object.entries(object).map(([key, value]) => ({ ...value, key }))
}
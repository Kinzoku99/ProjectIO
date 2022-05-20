export const getValueFromLS = (name: string, defaultValue: string) => {
    if (localStorage.getItem(name) != null) {
        return localStorage.getItem(name) as string;
    }
    else {
        return defaultValue;
    }
}
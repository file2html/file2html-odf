const dotsPattern: RegExp = /\./g;

export default function createClassName (selector: string): string {
    return selector.replace(dotsPattern, '_dot');
}
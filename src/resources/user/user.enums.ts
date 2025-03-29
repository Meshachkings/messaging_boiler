export enum userRole {
    BUYER = 'BUYER',
    SELLER = 'SELLER',
}

export const userExclude = `
    -password
    -email_verified
    -coordinate
    -online
    -verified
`;
